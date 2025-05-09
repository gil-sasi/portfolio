import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(MONGODB_URI);
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
  if (decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  if (req.method === "GET") {
    const users = await User.find({}, "-password"); // hide password field
    return res.status(200).json(users);
  }

  if (req.method === "PUT") {
    const { userId, isBanned } = req.body;
    await User.findByIdAndUpdate(userId, { isBanned });
    return res.status(200).json({ message: "User status updated" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
