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

  // skip & not log any localhost connection
  if (ip === "::1" || ip === "127.0.0.1") {
    return res.status(204).end();
  }

  try {
    //try to get country from GeoIP
    let country = "Unknown";
    try {
      const geo = await axios.get(`https://ipapi.co/${ip}/country_name/`);
      if (geo.data) {
        country = geo.data;
      }
    } catch (geoErr) {
      if (geoErr && typeof geoErr === "object" && "message" in geoErr) {
        console.warn(
          "GeoIP lookup failed:",
          (geoErr as { message: string }).message
        );
      } else {
        console.warn("GeoIP lookup failed:", geoErr);
      }
    }

    await Visitor.findOneAndUpdate(
      { ip },
      {
        $inc: { visitCount: 1 },
        lastVisit: new Date(),
        country,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Visitor tracking error:", err);
    res.status(500).json({ success: false });
  }
}
