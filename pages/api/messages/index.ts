import Message from "../../../models/Message";
import { connectToDatabase } from "../../../lib/mongodb";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
//	Handles GET for all messages — used to display the inbox.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  const session = (await getSession({ req })) as Session & {
    user: { role?: string };
  };

  if (!session || !session.user || session.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      res.status(200).json(messages);
    } catch (_err) {
      console.log(_err);
      res.status(500).json({ message: "Error fetching messages" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
