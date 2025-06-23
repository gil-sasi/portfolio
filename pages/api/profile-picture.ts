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
  console.log("🔥 Profile picture API called:", req.method);

  try {
    if (!mongoose.connections[0].readyState) {
      console.log("📡 Connecting to MongoDB...");
      await mongoose.connect(MONGODB_URI);
      console.log("✅ Connected to MongoDB");
    }

    if (req.method === "POST") {
      try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        console.log("🔍 Token received:", token ? "YES" : "NO");
        console.log("🔍 Token length:", token?.length);

        if (!token) {
          console.log("❌ No token provided");
          return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        console.log("🔍 Decoded token:", {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
        });

        const { profilePicture } = req.body;
        console.log(
          "📸 Profile picture received:",
          profilePicture ? "YES" : "NO"
        );
        console.log("📸 Profile picture length:", profilePicture?.length);
        console.log(
          "📸 Profile picture starts with:",
          profilePicture?.substring(0, 50)
        );

        // Ensure we have a valid user ID
        if (!decoded.id) {
          console.log("❌ No user ID in token");
          return res
            .status(400)
            .json({ message: "Invalid token: missing user ID" });
        }

        // Find user first to check if they exist
        const existingUser = await User.findById(decoded.id);
        console.log("👤 User found:", existingUser ? "YES" : "NO");
        if (existingUser) {
          console.log("👤 User details:", {
            email: existingUser.email,
            role: existingUser.role,
            currentProfilePicture: existingUser.profilePicture
              ? "HAS_PICTURE"
              : "NO_PICTURE",
          });
        }

        const user = await User.findByIdAndUpdate(
          decoded.id,
          { profilePicture },
          { new: true }
        ).select("-password");

        if (!user) {
          console.error("❌ User not found with ID:", decoded.id);
          return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ Profile picture updated successfully!");
        console.log("✅ Updated user:", {
          email: user.email,
          role: user.role,
          hasProfilePicture: !!user.profilePicture,
          profilePictureLength: user.profilePicture?.length,
        });

        res.status(200).json({
          message: "Profile picture updated successfully",
          profilePicture: user.profilePicture,
          success: true,
        });
      } catch (error) {
        console.error("❌ Error updating profile picture:", error);
        if (error instanceof jwt.JsonWebTokenError) {
          console.log("❌ JWT Error:", error.message);
          return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({
          message: "Failed to update profile picture",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else if (req.method === "DELETE") {
      try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
          return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        // Ensure we have a valid user ID
        if (!decoded.id) {
          return res
            .status(400)
            .json({ message: "Invalid token: missing user ID" });
        }

        const user = await User.findByIdAndUpdate(
          decoded.id,
          { profilePicture: null },
          { new: true }
        ).select("-password");

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ Profile picture removed successfully for:", user.email);
        res.status(200).json({
          message: "Profile picture removed successfully",
        });
      } catch (error) {
        console.error("❌ Error removing profile picture:", error);
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({
          message: "Failed to remove profile picture",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      res.setHeader("Allow", ["POST", "DELETE"]);
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("❌ Database connection error:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
