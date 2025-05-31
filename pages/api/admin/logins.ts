import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/verifyAdminToken";
import mongoose from "mongoose";

const loginSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    ip: String,
  },
  { timestamps: true }
);

const Login = mongoose.models.Login || mongoose.model("Login", loginSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = verifyAdminToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  await connectToDatabase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

  try {
    const rawStats = await Login.aggregate([
      { $match: { date: { $gte: oneWeekAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const rawMap: Record<string, number> = {};
    rawStats.forEach((entry) => {
      rawMap[entry._id] = entry.count;
    });

    const fullStats = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(oneWeekAgo);
      date.setDate(oneWeekAgo.getDate() + i);
      const formatted = date.toISOString().slice(0, 10); // YYYY-MM-DD
      return {
        date: formatted,
        count: rawMap[formatted] || 0,
      };
    });

    return res.status(200).json(fullStats);
  } catch (err) {
    console.error("Login stats aggregation error:", err);
    return res.status(500).json({ error: "Failed to load login stats" });
  }
}
