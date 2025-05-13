import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../../models/User";

const MONGODB_URI = process.env.MONGODB_URI!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { resetCode, newPassword } = req.body;

  if (!resetCode || !newPassword) {
    return res
      .status(400)
      .json({ message: "Reset code and new password are required" });
  }

  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(MONGODB_URI);
    }

    // Find user by reset code
    const user = await User.findOne({ resetCode });
    if (!user) {
      return res.status(400).json({ message: "Invalid or unknown reset code" });
    }

    // Validate code expiration
    const now = new Date();
    if (!user.resetCodeExpires || user.resetCodeExpires < now) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    // Prevent weak passwords (optional)
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Hash and save the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in reset-password API:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
}
