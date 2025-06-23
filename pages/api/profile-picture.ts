import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../../models/User";

const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface DecodedToken {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

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

        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        const { profilePicture } = req.body;

        const user = await User.findByIdAndUpdate(
          decoded.id,
          { profilePicture },
          { new: true }
        ).select("-password");

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
          message: "Profile picture updated successfully",
          profilePicture: user.profilePicture,
        });
      } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ message: "Failed to update profile picture" });
      }
    } else if (req.method === "DELETE") {
      try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
          return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        const user = await User.findByIdAndUpdate(
          decoded.id,
          { profilePicture: null },
          { new: true }
        ).select("-password");

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
          message: "Profile picture removed successfully",
        });
      } catch (error) {
        console.error("Error removing profile picture:", error);
        res.status(500).json({ message: "Failed to remove profile picture" });
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
