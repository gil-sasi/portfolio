import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { verifyAdminToken } from "@/lib/verifyAdminToken";

const projectVisitorSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  projectName: { type: String, required: true },
  ip: { type: String, required: true },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  firstVisit: { type: Date, default: Date.now },
  country: { type: String, default: "Unknown" },
  userAgent: { type: String, default: "" },
  referrer: { type: String, default: "" },
  isValidVisitor: { type: Boolean, default: true },
});

projectVisitorSchema.index({ projectId: 1, ip: 1 });
projectVisitorSchema.index({ projectId: 1, lastVisit: -1 });
projectVisitorSchema.index({ lastVisit: -1 });

const ProjectVisitor =
  mongoose.models.ProjectVisitor ||
  mongoose.model("ProjectVisitor", projectVisitorSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = verifyAdminToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const { projectId, summary = "false" } = req.query;

      if (summary === "true") {
        // Get project summary statistics
        const projectStats = await ProjectVisitor.aggregate([
          {
            $match: {
              isValidVisitor: { $ne: false },
            },
          },
          {
            $group: {
              _id: "$projectId",
              projectName: { $first: "$projectName" },
              totalVisits: { $sum: "$visitCount" },
              uniqueVisitors: { $sum: 1 },
              lastVisit: { $max: "$lastVisit" },
              countries: { $addToSet: "$country" },
            },
          },
          {
            $sort: { totalVisits: -1 },
          },
        ]);

        const formatted = projectStats.map((stat) => ({
          projectId: stat._id,
          projectName: stat.projectName,
          totalVisits: stat.totalVisits,
          uniqueVisitors: stat.uniqueVisitors,
          lastVisit: stat.lastVisit?.toISOString() ?? null,
          countriesCount: stat.countries.length,
          topCountries: stat.countries.slice(0, 3),
        }));

        return res.status(200).json(formatted);
      }

      if (projectId) {
        // Get detailed visitors for a specific project
        const visitors = await ProjectVisitor.find({
          projectId,
          isValidVisitor: { $ne: false },
        })
          .sort({ lastVisit: -1 })
          .limit(200);

        const formatted = visitors.map((v) => ({
          ip: v.ip,
          visitCount: v.visitCount,
          lastVisit: v.lastVisit?.toISOString() ?? null,
          firstVisit:
            v.firstVisit?.toISOString() ?? v.lastVisit?.toISOString() ?? null,
          country: v.country || "Unknown",
          userAgent: v.userAgent || "",
          referrer: v.referrer || "",
        }));

        return res.status(200).json(formatted);
      }

      // Get all project visitors (recent activity)
      const recentVisitors = await ProjectVisitor.find({
        isValidVisitor: { $ne: false },
      })
        .sort({ lastVisit: -1 })
        .limit(100);

      const formatted = recentVisitors.map((v) => ({
        projectId: v.projectId,
        projectName: v.projectName,
        ip: v.ip,
        visitCount: v.visitCount,
        lastVisit: v.lastVisit?.toISOString() ?? null,
        firstVisit:
          v.firstVisit?.toISOString() ?? v.lastVisit?.toISOString() ?? null,
        country: v.country || "Unknown",
        userAgent: v.userAgent || "",
        referrer: v.referrer || "",
      }));

      res.status(200).json(formatted);
    } catch (err) {
      console.error("Admin project visitors fetch error:", err);
      res.status(500).json({ error: "Failed to load project visitors" });
    }
  } else if (req.method === "DELETE") {
    // Delete project visitor records
    try {
      const { projectId, cleanup = "false" } = req.body;

      if (cleanup === "true") {
        // Clean up invalid project visitor records
        const deleteResult = await ProjectVisitor.deleteMany({
          $or: [
            { isValidVisitor: false },
            { ip: { $in: ["unknown", "127.0.0.1", "::1"] } },
            { userAgent: { $regex: /bot|crawler|spider/i } },
            { visitCount: { $lt: 1 } },
          ],
        });

        return res.status(200).json({
          message: `Cleaned up ${deleteResult.deletedCount} invalid project visitor records`,
        });
      }

      if (projectId) {
        // Delete all visitors for a specific project
        const deleteResult = await ProjectVisitor.deleteMany({ projectId });
        return res.status(200).json({
          message: `Deleted ${deleteResult.deletedCount} visitor records for project ${projectId}`,
        });
      }

      res.status(400).json({ error: "Project ID or cleanup flag required" });
    } catch (err) {
      console.error("Delete project visitors error:", err);
      res.status(500).json({ error: "Failed to delete project visitors" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
