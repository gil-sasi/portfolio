import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import ContactInfoModel from "../../models/ContactInfo";

// Load the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI!;

// The API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to MongoDB if not already connected
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    // Fetch the first and only ContactInfo document from the collection
    const doc = await ContactInfoModel.findOne();

    // Return it if found, or return an empty object if null
    return res.status(200).json(doc || {});
  } catch (err) {
    console.error("Failed to fetch contact info:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
