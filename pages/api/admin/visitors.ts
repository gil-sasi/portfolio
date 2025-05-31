import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { verifyAdminToken } from "@/lib/verifyAdminToken";

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  country: { type: String, default: "Unknown" },
});

const Visitor =
  mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = verifyAdminToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  await connectToDatabase();

  try {
    const visitors = await Visitor.find().sort({ lastVisit: -1 }).limit(500);

    const formatted = visitors.map((v) => ({
      ip: v.ip,
      visitCount: v.visitCount,
      lastVisit: v.lastVisit?.toISOString() ?? null,
      country: v.country || "Unknown",
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Admin visitors fetch error:", err);
    res.status(500).json({ error: "Failed to load visitors" });
  }
}
