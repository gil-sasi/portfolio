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

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // include today
  oneWeekAgo.setHours(0, 0, 0, 0);

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

    // Format to { date, count }
    const formatted = results.map((r) => ({ date: r._id, count: r.count }));
    return res.status(200).json(formatted);
  } catch (err) {
    console.error("Login aggregation failed:", err);
    return res.status(500).json({ error: "Failed to fetch login stats" });
  }
}
