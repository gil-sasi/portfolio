import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
});

const Visitor =
  mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  try {
    await Visitor.findOneAndUpdate(
      { ip },
      {
        $inc: { visitCount: 1 },
        lastVisit: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Visitor tracking error:", err);
    res.status(500).json({ success: false });
  }
}
