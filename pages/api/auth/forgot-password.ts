import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import crypto from "crypto";
import User from "../../../models/User";
import nodemailer from "nodemailer";

const MONGODB_URI = process.env.MONGODB_URI!;
const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;
const RESET_CODE_EXPIRATION = 60 * 60 * 1000; // 1 hour

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "A valid email is required" });
  }

  try {
    // Ensure DB is connected
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(MONGODB_URI);
    }

    const user = await User.findOne({ email });

    // Show error if email not found
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found in our Database" });
    }

    //  Generate a 6-digit hex reset code
    const resetCode = crypto.randomBytes(3).toString("hex");
    const resetCodeExpires = new Date(Date.now() + RESET_CODE_EXPIRATION);

    //  Save to DB
    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    //  Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"My Portfolio" <${EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}\n\nIt will expire in 1 hour.`,
    });

    return res.status(200).json({ message: "Reset code sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
