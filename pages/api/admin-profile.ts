import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    // Find the admin user
    const adminUser = await User.findOne({ role: "admin" }).select("-password");

    if (!adminUser) {
      // Create a default admin user if none exists
      const defaultAdmin = new User({
        firstName: "Gil",
        lastName: "Shalev",
        email: "admin@portfolio.com",
        password: "temp123", // You should change this
        role: "admin",
        isBanned: false,
        loginHistory: [],
      });

      await defaultAdmin.save();

      return res.status(200).json({
        firstName: defaultAdmin.firstName,
        lastName: defaultAdmin.lastName,
        profilePicture: defaultAdmin.profilePicture,
      });
    }

    res.status(200).json({
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      profilePicture: adminUser.profilePicture,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({
      message: "Failed to fetch admin profile",
      error:
        process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : undefined,
    });
  }
}
