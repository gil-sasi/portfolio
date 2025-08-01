import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("🔄 Testing database connection...");
    
    // Test the connection
    const mongoose = await connectToDatabase();
    
    // Check if database is available
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    
    // Test a simple query
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }
    const collections = await db.listCollections().toArray();
    
    console.log("✅ Database connection successful");
    
    res.status(200).json({
      message: "Database connection successful",
      collections: collections.map(col => col.name),
      connectionState: mongoose.connection.readyState,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    
    res.status(500).json({
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
} 