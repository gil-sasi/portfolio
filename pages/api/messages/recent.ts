import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import Message from "../../../models/Message";
import { connectToDatabase } from "../../../lib/mongodb";
//	Used for fetching only recent messages — shown in the Navbar dropdown.
const JWT_SECRET = process.env.JWT_SECRET || "my_very_secret_key_12345";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5);
    return res.status(200).json(recentMessages);
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}
