import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import Message from "../../../models/Message";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.method === "GET") {
      const messages = await Message.find({}).sort({ createdAt: -1 });
      return res.status(200).json(messages);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (_err) {
    console.error("Token verification failed:", _err);
    return res.status(401).json({ message: "Invalid token" });
  }
}
