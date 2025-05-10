import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import ContactInfoModel from "../../../models/ContactInfo";
import jwt from "jsonwebtoken";

const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(MONGODB_URI);
  }

  // GET: Allow public read access (no token required)
  if (req.method === "GET") {
    try {
      const doc = await ContactInfoModel.findOne();
      return res.status(200).json(doc || {});
    } catch (err) {
      console.error("Failed to fetch contact info:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST: Admins only
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }

  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "POST") {
    const { email, socials } = req.body;

    try {
      const doc = await ContactInfoModel.findOne();
      if (doc) {
        doc.email = email;
        doc.socials = socials;
        await doc.save();
      } else {
        await ContactInfoModel.create({ email, socials });
      }

      return res.status(200).json({ message: "Contact info saved" });
    } catch (err) {
      console.error("Saving contact info failed:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
