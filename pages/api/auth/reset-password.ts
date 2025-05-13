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
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { resetCode, newPassword } = req.body;

  if (!resetCode || !newPassword) {
    return res
      .status(400)
      .json({ message: "Reset code and new password are required" });
  }

  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    // Find the user by reset code
    const user = await User.findOne({ resetCode });
    if (!user) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    // Check if reset code has expired
    if (user.resetCodeExpires < new Date()) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = undefined; // Clear the reset code after password change
    user.resetCodeExpires = undefined; // Clear expiration
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error handling password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
