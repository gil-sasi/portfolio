import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";

type ContactData = {
  name: string;
  email: string;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { name, email, message } = req.body as ContactData;

  if (!name || !email || !message) {
    res.status(400).json({ message: "Missing fields" });
    return;
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("contacts");

    await collection.insertOne({ name, email, message, createdAt: new Date() });

    res.status(200).json({ message: "Message received!" });
  } catch (error) {
    console.error("❌ Contact API Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
