import type { NextApiRequest, NextApiResponse } from "next";
import Message from "../../models/Message";
import { connectToDatabase } from "../../lib/mongodb";

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
    await connectToDatabase();

    await Message.create({ name, email, message });
    return res.status(200).json({ message: "Message received" });
  } catch (err) {
    console.error("Message error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
