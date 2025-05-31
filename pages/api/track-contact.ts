import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  platform: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const ContactLog =
  mongoose.models.ContactLog || mongoose.model("ContactLog", schema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectToDatabase();
  const { platform } = req.body;

  if (!platform) return res.status(400).json({ error: "Platform required" });

  await ContactLog.create({ platform });
  res.status(200).json({ success: true });
}
