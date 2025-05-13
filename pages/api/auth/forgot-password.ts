import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import crypto from "crypto"; // To generate the reset code
import User from "../../../models/User";
import nodemailer from "nodemailer";

const MONGODB_URI = process.env.MONGODB_URI!;
const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;
const RESET_CODE_EXPIRATION = 3600 * 1000; // 1 hour

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random 6-digit reset code
    const resetCode = crypto.randomBytes(3).toString("hex"); // 6-digit code (3 bytes)

    // Set expiration time for the reset code (1 hour from now)
    const resetCodeExpires = new Date(Date.now() + RESET_CODE_EXPIRATION);

    // Store the reset code and expiration time in the user document
    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    // Send reset code to user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Your password reset code is: ${resetCode}. It will expire in 1 hour.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email", error });
      }
      res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
