import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import About from "../../models/About";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(MONGODB_URI);
  }

  if (req.method === "GET") {
    try {
      const doc = await About.findOne();
      return res.status(200).json({ content: doc?.content || "" });
    } catch (err) {
      console.error("GET about error:", err);
      return res.status(500).json({ message: "Failed to fetch about content" });
    }
  }

  if (req.method === "POST") {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Only admin can update about" });
      }

      const { content } = req.body;
      if (!content) return res.status(400).json({ message: "Missing content" });

      const doc = await About.findOne();
      if (doc) {
        doc.content = content;
        await doc.save();
      } else {
        await About.create({ content });
      }

      return res.status(200).json({ message: "About updated" });
    } catch (err) {
      console.error("POST about error:", err);
      return res.status(500).json({ message: "Failed to update about" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
