import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../../models/User";

const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    if (req.method === "POST") {
      try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
          return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { profilePicture } = req.body;

        const user = await User.findByIdAndUpdate(
          decoded.id,
          { profilePicture },
          { new: true }
        ).select("-password");

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile picture updated", user });
      } catch (error) {
        console.error("Profile picture update error:", error);
        res.status(500).json({ message: "Error updating profile picture" });
      }
    } else if (req.method === "DELETE") {
      try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
          return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;

        const user = await User.findByIdAndUpdate(
          decoded.id,
          { profilePicture: null },
          { new: true }
        ).select("-password");

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile picture removed", user });
      } catch (error) {
        console.error("Profile picture removal error:", error);
        res.status(500).json({ message: "Error removing profile picture" });
      }
    } else {
      res.setHeader("Allow", ["POST", "DELETE"]);
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
}
