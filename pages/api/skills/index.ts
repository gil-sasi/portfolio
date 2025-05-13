import { NextApiRequest, NextApiResponse } from "next";
import Skill from "../../../models/Skills";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const skills = await Skill.find({});
      res.status(200).json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, category } = req.body;

      if (!name || !category) {
        return res
          .status(400)
          .json({ error: "Name and category are required" });
      }

      const newSkill = new Skill({
        name,
        category,
      });

      await newSkill.save();
      res.status(201).json(newSkill);
    } catch (error) {
      console.error("Error adding skill:", error);
      res.status(500).json({ error: "Failed to add skill" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
