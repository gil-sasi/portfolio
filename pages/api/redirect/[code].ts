import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  try {
    const db = await connectToDatabase();

    const found = await db.collection("links").findOne({ shortCode: code });

    if (!found) {
      res.writeHead(302, { Location: "/not-found" });
      res.end();
      return;
    }

    res.writeHead(302, { Location: found.originalUrl });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).end("Redirect failed");
  }
}
