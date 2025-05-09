import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User";

const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const lang = req.headers["accept-language"] === "he" ? "he" : "en";
  const t = (en: string, he: string) => (lang === "he" ? he : en);

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: t("Method not allowed", "השיטה אינה מותרת") });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: t("Email and password are required", "נדרש אימייל וסיסמה"),
    });
  }

  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: t("Invalid email or password", "אימייל או סיסמה שגויים"),
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: t("Invalid email or password", "אימייל או סיסמה שגויים"),
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: t("Internal server error", "שגיאת שרת פנימית"),
    });
  }
}
