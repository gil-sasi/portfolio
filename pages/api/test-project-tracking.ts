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
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    // Create a test project visit
    const testVisit = {
      projectId: "test-project",
      projectName: "Test Project",
      ip: "192.168.1.100", // Test IP
      visitCount: 1,
      lastVisit: new Date(),
      firstVisit: new Date(),
      country: "Test Country",
      userAgent: "Test User Agent",
      referrer: "Test Referrer",
      isValidVisitor: true,
    };

    const savedVisit = await ProjectVisitor.create(testVisit);

    // Get all project visits to verify
    const allVisits = await ProjectVisitor.find().limit(10);
    const projectCount = await ProjectVisitor.countDocuments();

    res.status(200).json({
      success: true,
      message: "Project tracking test successful",
      testVisit: savedVisit,
      totalProjectVisits: projectCount,
      recentVisits: allVisits.map((v) => ({
        projectId: v.projectId,
        projectName: v.projectName,
        ip: v.ip,
        visitCount: v.visitCount,
        lastVisit: v.lastVisit,
        isValidVisitor: v.isValidVisitor,
      })),
      databaseConnection:
        mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    });
  } catch (error) {
    console.error("Test project tracking error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      databaseConnection:
        mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    });
  }
}
