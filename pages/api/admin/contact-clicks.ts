import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAdminToken } from "@/lib/verifyAdminToken";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

const clickSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Click = mongoose.models.Click || mongoose.model("Click", clickSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = verifyAdminToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectToDatabase();

  try {
    const agg = await Click.aggregate([
      {
        $group: {
          _id: "$platform",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const formatted = agg.map((entry) => ({
      platform: entry._id,
      count: entry.count,
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("Click aggregation failed:", err);
    return res.status(500).json({ error: "Failed to fetch click stats" });
  }
}
