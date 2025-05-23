import type { NextApiRequest, NextApiResponse } from "next";
import { getRawDb } from "@/lib/mongoclient";

const generateCode = () => Math.random().toString(36).substring(2, 8);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const db = await getRawDb(); // raw mongo client
    const shortCode = generateCode();

    await db.collection("links").insertOne({
      shortCode,
      originalUrl: url,
      createdAt: new Date(),
    });

    res.status(200).json({ shortCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to shorten URL" });
  }
}
