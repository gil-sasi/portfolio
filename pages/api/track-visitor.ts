import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import axios from "axios";

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
  await connectToDatabase();

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  // Skip localhost
  if (ip === "::1" || ip === "127.0.0.1") {
    return res.status(204).end();
  }

  // Skip bots
  const userAgent = req.headers["user-agent"] || "";
  const isBot = /bot|crawl|spider|slurp|curl|wget/i.test(userAgent);
  if (isBot) {
    return res.status(204).end();
  }

  try {
    // Lookup visitor by IP
    const existing = await Visitor.findOne({ ip });

    // Only increment visitCount if 15min have passed since lastVisit
    let shouldIncrement = true;
    if (existing && existing.lastVisit) {
      const minutesSinceLastVisit =
        (Date.now() - new Date(existing.lastVisit).getTime()) / (60 * 1000);
      shouldIncrement = minutesSinceLastVisit >= 15;
    }

    // Always update lastVisit, but increment visitCount only if enough time has passed
    let update: any = {
      lastVisit: new Date(),
    };

    if (shouldIncrement) {
      update.$inc = { visitCount: 1 };
    }

    // Get country (fallback to existing or unknown)
    let country = existing?.country || "Unknown";
    try {
      const geo = await axios.get(`https://ipapi.co/${ip}/country_name/`);
      if (geo.data) {
        country = geo.data;
      }
    } catch {
      // Don’t block on geo errors
    }
    update.country = country;

    await Visitor.findOneAndUpdate({ ip }, update, { upsert: true, new: true });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Visitor tracking error:", err);
    res.status(500).json({ success: false });
  }
}
