import mongoose, { Schema, Document, models } from "mongoose";

export interface IChallenge extends Document {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  technologies: string[];
  category:
    | "react"
    | "javascript"
    | "css"
    | "typescript"
    | "nextjs"
    | "node"
    | "general";
  requirements: string[];
  hints: string[];
  exampleCode?: string;
  createdAt: Date;
  isActive: boolean;
  estimatedTime: number; // in minutes
  userId?: string; // if challenge was requested by specific user
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    technologies: [{ type: String, required: true }],
    category: {
      type: String,
      enum: [
        "react",
        "javascript",
        "css",
        "typescript",
        "nextjs",
        "node",
        "general",
      ],
      required: true,
    },
    requirements: [{ type: String, required: true }],
    hints: [{ type: String }],
    exampleCode: { type: String },
    isActive: { type: Boolean, default: true },
    estimatedTime: { type: Number, required: true }, // in minutes
    userId: { type: String }, // Optional: for user-specific challenges
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.Challenge ||
  mongoose.model<IChallenge>("Challenge", ChallengeSchema);
