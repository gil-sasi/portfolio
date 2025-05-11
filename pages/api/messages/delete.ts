// pages/api/messages/delete.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Message from "../../../models/Message";
import jwt from "jsonwebtoken";

const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(MONGODB_URI);
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { role: string };
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { messageId } = req.body;
  if (!messageId) {
    return res.status(400).json({ message: "Missing messageId" });
  }

  try {
    const result = await Message.findByIdAndDelete(messageId);
    if (!result) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Failed to delete message" });
  }
}
