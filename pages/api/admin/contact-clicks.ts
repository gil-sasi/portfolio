import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { verifyAdminToken } from "@/lib/verifyAdminToken";

const clickSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  count: { type: Number, default: 1 },
});

const Click = mongoose.models.Click || mongoose.model("Click", clickSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = verifyAdminToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  await connectToDatabase();

  const topPlatforms = await Click.find().sort({ count: -1 }).limit(5);
  res.status(200).json(topPlatforms);
}
