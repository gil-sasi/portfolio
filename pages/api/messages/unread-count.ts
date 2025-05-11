import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import Message from "../../../models/Message";
import { verifyAdminToken } from "../../../lib/verifyAdminToken";
//	Returns how many unread messages there are — also used in Navbar bell icon.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const decoded = verifyAdminToken(req);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const count = await Message.countDocuments({ read: false });
    return res.status(200).json({ count });
  } catch (err) {
    return res.status(500).json({ message: "Failed to count unread messages" });
  }
}
