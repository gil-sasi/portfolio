import mongoose, { Schema, Document, models } from "mongoose";

export interface ICodeSubmission extends Document {
  userId: string;
  challengeId: string;
  code: string;
  language: "javascript" | "typescript" | "react" | "html" | "css" | "other";
  submissionMethod: "paste" | "github" | "pastebin" | "direct";
  githubUrl?: string;
  pastebinUrl?: string;
  notes?: string;
  submittedAt: Date;
  isReviewed: boolean;
  reviewId?: string;
  userEmail?: string;
  userName?: string;
}

const CodeSubmissionSchema = new Schema<ICodeSubmission>(
  {
    userId: { type: String, required: true },
    challengeId: { type: String, required: true },
    code: { type: String, required: true },
    language: {
      type: String,
      enum: ["javascript", "typescript", "react", "html", "css", "other"],
      required: true,
    },
    submissionMethod: {
      type: String,
      enum: ["paste", "github", "pastebin", "direct"],
      required: true,
    },
    githubUrl: { type: String },
    pastebinUrl: { type: String },
    notes: { type: String },
    isReviewed: { type: Boolean, default: false },
    reviewId: { type: String },
    userEmail: { type: String },
    userName: { type: String },
  },
  { timestamps: { createdAt: "submittedAt", updatedAt: false } }
);

// Index for faster queries
CodeSubmissionSchema.index({ userId: 1, challengeId: 1 });
CodeSubmissionSchema.index({ submittedAt: -1 });

export default models.CodeSubmission ||
  mongoose.model<ICodeSubmission>("CodeSubmission", CodeSubmissionSchema);
