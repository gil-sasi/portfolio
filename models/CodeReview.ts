import mongoose, { Schema, Document, models } from "mongoose";

export interface ICodeReview extends Document {
  submissionId: string;
  userId: string;
  challengeId: string;
  overallScore: number; // 1-10 scale
  feedback: {
    strengths: string[];
    improvements: string[];
    bugs: string[];
    suggestions: string[];
  };
  codeQuality: {
    readability: number; // 1-10
    structure: number; // 1-10
    efficiency: number; // 1-10
    bestPractices: number; // 1-10
  };
  careerTips: string[];
  nextSteps: string[];
  resources: {
    title: string;
    url: string;
    type: "article" | "video" | "tutorial" | "documentation";
  }[];
  reviewedAt: Date;
  aiModel: string; // e.g., "gpt-4", "claude-3"
  reviewVersion: number; // for tracking review format versions
}

const CodeReviewSchema = new Schema<ICodeReview>(
  {
    submissionId: { type: String, required: true },
    userId: { type: String, required: true },
    challengeId: { type: String, required: true },
    overallScore: { type: Number, required: true, min: 1, max: 10 },
    feedback: {
      strengths: [{ type: String }],
      improvements: [{ type: String }],
      bugs: [{ type: String }],
      suggestions: [{ type: String }],
    },
    codeQuality: {
      readability: { type: Number, required: true, min: 1, max: 10 },
      structure: { type: Number, required: true, min: 1, max: 10 },
      efficiency: { type: Number, required: true, min: 1, max: 10 },
      bestPractices: { type: Number, required: true, min: 1, max: 10 },
    },
    careerTips: [{ type: String }],
    nextSteps: [{ type: String }],
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: {
          type: String,
          enum: ["article", "video", "tutorial", "documentation"],
          required: true,
        },
      },
    ],
    aiModel: { type: String, required: true },
    reviewVersion: { type: Number, default: 1 },
  },
  { timestamps: { createdAt: "reviewedAt", updatedAt: false } }
);

// Index for faster queries
CodeReviewSchema.index({ userId: 1, challengeId: 1 });
CodeReviewSchema.index({ submissionId: 1 });
CodeReviewSchema.index({ reviewedAt: -1 });

export default models.CodeReview ||
  mongoose.model<ICodeReview>("CodeReview", CodeReviewSchema);
