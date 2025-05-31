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
  oneWeekAgo.setDate(today.getDate() - 6); // Show 7 days including today

  try {
    const results = await Login.aggregate([
      {
        $match: {
          date: { $gte: oneWeekAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Ensure all 7 days are included, even if count is 0
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const loginMap = Object.fromEntries(results.map((r) => [r._id, r.count]));

    const completeStats = days.map((date) => ({
      date,
      count: loginMap[date] || 0,
    }));

    return res.status(200).json(completeStats);
  } catch (err) {
    console.error("Login aggregation failed:", err);
    return res.status(500).json({ error: "Failed to fetch login stats" });
  }
}
