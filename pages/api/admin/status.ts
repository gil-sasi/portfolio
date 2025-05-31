import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import pkg from "../../../package.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();
    const isConnected = mongoose.connection.readyState === 1;

    res.status(200).json({
      version: pkg.version,
      deployedAt: process.env.DEPLOYED_AT || new Date().toISOString(),
      mongoConnected: isConnected,
    });
  } catch {
    res.status(500).json({
      version: pkg.version,
      deployedAt: process.env.DEPLOYED_AT || new Date().toISOString(),
      mongoConnected: false,
    });
  }
}
