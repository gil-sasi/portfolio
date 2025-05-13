import { NextApiRequest, NextApiResponse } from "next";
import Skill from "../../../models/Skills";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      const skill = await Skill.findByIdAndDelete(id); // Delete the skill by ID
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
