import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

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

const ProjectVisitor =
  mongoose.models.ProjectVisitor ||
  mongoose.model("ProjectVisitor", projectVisitorSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();

    if (req.method === "POST") {
      // Create test visits for debugging
      const testVisits = [
        {
          projectId: "dave-game",
          projectName: "Dave's Adventure Game",
          ip: "192.168.1.100",
          visitCount: 1,
          lastVisit: new Date(),
          firstVisit: new Date(),
          country: "Israel",
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          referrer: "http://localhost:3000/projects",
          isValidVisitor: true,
        },
        {
          projectId: "visitor-management",
          projectName: "Coca-Cola Visitor Management App",
          ip: "192.168.1.101",
          visitCount: 2,
          lastVisit: new Date(),
          firstVisit: new Date(Date.now() - 86400000), // 1 day ago
          country: "Israel",
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          referrer: "http://localhost:3000/projects",
          isValidVisitor: true,
        },
        {
          projectId: "barbershop",
          projectName: "Barbershop Management App",
          ip: "192.168.1.102",
          visitCount: 3,
          lastVisit: new Date(),
          firstVisit: new Date(Date.now() - 172800000), // 2 days ago
          country: "Israel",
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          referrer: "http://localhost:3000/projects",
          isValidVisitor: true,
        },
      ];

      // Insert test data
      await ProjectVisitor.insertMany(testVisits);

      return res.status(200).json({
        success: true,
        message: "Test project visits created successfully",
        createdVisits: testVisits.length,
      });
    }

    if (req.method === "GET") {
      // Get all project visits for debugging
      const allVisits = await ProjectVisitor.find().sort({ lastVisit: -1 });
      const stats = await ProjectVisitor.aggregate([
        {
          $group: {
            _id: "$projectId",
            projectName: { $first: "$projectName" },
            totalVisits: { $sum: "$visitCount" },
            uniqueVisitors: { $sum: 1 },
            lastVisit: { $max: "$lastVisit" },
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        totalProjectVisitorRecords: allVisits.length,
        projectStats: stats,
        recentVisits: allVisits.slice(0, 10),
        databaseConnection:
          mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      });
    }

    if (req.method === "DELETE") {
      // Clear all project visits for fresh testing
      const deleteResult = await ProjectVisitor.deleteMany({});
      return res.status(200).json({
        success: true,
        message: `Deleted ${deleteResult.deletedCount} project visit records`,
      });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Debug project tracking error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      databaseConnection:
        mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    });
  }
}
