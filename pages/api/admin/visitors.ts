import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { verifyAdminToken } from "@/lib/verifyAdminToken";

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  firstVisit: { type: Date, default: Date.now },
  country: { type: String, default: "Unknown" },
  userAgent: { type: String, default: "" },
  referrer: { type: String, default: "" },
  isValidVisitor: { type: Boolean, default: true },
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

  if (req.method === "GET") {
    try {
      const {
        includeInvalid = "false",
        cleanup = "false",
        migrate = "false",
      } = req.query;

      // Optional migration for existing records
      if (migrate === "true") {
        console.log("Starting visitor data migration...");

        // Update existing records that don't have the new fields
        const migrationResult = await Visitor.updateMany(
          {
            $or: [
              { userAgent: { $exists: false } },
              { firstVisit: { $exists: false } },
              { isValidVisitor: { $exists: false } },
              { referrer: { $exists: false } },
            ],
          },
          {
            $set: {
              userAgent: "",
              referrer: "",
              isValidVisitor: true,
              // Set firstVisit to lastVisit for existing records (best approximation)
              firstVisit: "$lastVisit",
            },
          }
        );

        console.log(
          `Migrated ${migrationResult.modifiedCount} visitor records`
        );

        // For records where we can't determine firstVisit, set it to a reasonable fallback
        await Visitor.updateMany({ firstVisit: { $exists: false } }, [
          {
            $set: {
              firstVisit: { $ifNull: ["$firstVisit", "$lastVisit"] },
            },
          },
        ]);
      }

      // Optional cleanup operation
      if (cleanup === "true") {
        const deleteResult = await Visitor.deleteMany({
          $or: [
            { isValidVisitor: false },
            { ip: { $in: ["unknown", "127.0.0.1", "::1"] } },
            { userAgent: { $regex: /bot|crawler|spider/i } },
            { visitCount: { $lt: 1 } },
          ],
        });

        console.log(
          `Cleaned up ${deleteResult.deletedCount} invalid visitor records`
        );
      }

      // Build query based on parameters
      let query = {};
      if (includeInvalid !== "true") {
        query = {
          isValidVisitor: { $ne: false },
          ip: { $nin: ["unknown", "127.0.0.1", "::1"] },
        };
      }

      const visitors = await Visitor.find(query)
        .sort({ lastVisit: -1 })
        .limit(500);

      const formatted = visitors.map((v) => ({
        ip: v.ip,
        visitCount: v.visitCount,
        lastVisit: v.lastVisit?.toISOString() ?? null,
        firstVisit:
          v.firstVisit?.toISOString() ?? v.lastVisit?.toISOString() ?? null,
        country: v.country || "Unknown",
        userAgent: v.userAgent || "",
        referrer: v.referrer || "",
        isValidVisitor: v.isValidVisitor !== false,
      }));

      res.status(200).json(formatted);
    } catch (err) {
      console.error("Admin visitors fetch error:", err);
      res.status(500).json({ error: "Failed to load visitors" });
    }
  } else if (req.method === "DELETE") {
    // Delete specific visitor by IP
    try {
      const { ip } = req.body;
      if (!ip) {
        return res.status(400).json({ error: "IP address required" });
      }

      const deleteResult = await Visitor.deleteOne({ ip });

      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ error: "Visitor not found" });
      }

      res.status(200).json({ message: "Visitor deleted successfully" });
    } catch (err) {
      console.error("Delete visitor error:", err);
      res.status(500).json({ error: "Failed to delete visitor" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
