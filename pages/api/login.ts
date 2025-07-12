import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import User from "../../models/User";
import { connectToDatabase } from "../../lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const lang = req.headers["accept-language"] === "he" ? "he" : "en";
  const t = (en: string, he: string) => (lang === "he" ? he : en);

  if (req.method !== "POST") {
    return res.status(405).json({
      message: t("Method not allowed", "השיטה אינה מותרת"),
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: t("Email and password are required", "נדרש אימייל וסיסמה"),
    });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: t("Invalid email or password", "אימייל או סיסמה שגויים"),
      });
    }

    // 🚫 Check if the user is banned
    if (user.isBanned) {
      return res.status(403).json({
        message: t("Your account is banned", "החשבון שלך נחסם"),
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: t("Invalid email or password", "אימייל או סיסמה שגויים"),
      });
    }

    // 🕓 Record login time and IP
    const israelNow = moment().tz("Asia/Jerusalem").toDate();
    const userIp =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "unknown";

    user.lastLogin = { date: israelNow, ip: userIp };
    user.loginHistory.push({ date: israelNow, ip: userIp });
    await user.save();

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

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: t("Internal server error", "שגיאת שרת פנימית"),
    });
  }
}
