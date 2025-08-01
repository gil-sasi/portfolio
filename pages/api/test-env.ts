import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const envVars = {
    MONGODB_URI: process.env.MONGODB_URI ? "✅ Set" : "❌ Not set",
    JWT_SECRET: process.env.JWT_SECRET ? "✅ Set" : "❌ Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
    VERCEL_ENV: process.env.VERCEL_ENV || "Not set",
  };

  res.status(200).json({
    message: "Environment variables check",
    envVars,
    timestamp: new Date().toISOString(),
  });
} 