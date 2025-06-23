import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import User from "../../models/User";

const MONGODB_URI = process.env.MONGODB_URI!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    // Find the admin user
    const adminUser = await User.findOne({ role: "admin" }).select("-password");
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    res.status(200).json({
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      profilePicture: adminUser.profilePicture,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Failed to fetch admin profile" });
  }
}
