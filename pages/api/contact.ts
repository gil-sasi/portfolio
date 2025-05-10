import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Message from "../../models/Message";

const MONGODB_URI = process.env.MONGODB_URI!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    await Message.create({ name, email, message });
    return res.status(200).json({ message: "Message received" });
  } catch (err) {
    console.error("Message error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
