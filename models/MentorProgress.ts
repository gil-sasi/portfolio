import mongoose, { Schema, Document, models } from "mongoose";

export interface IMentorProgress extends Document {
  userId: string;
  userEmail: string;
  userName: string;
  totalChallenges: number;
  completedChallenges: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  lastChallengeDate: Date;
  skillScores: {
    javascript: number;
    react: number;
    typescript: number;
    css: number;
    nextjs: number;
    node: number;
    general: number;
  };
  difficultyProgress: {
    beginner: { completed: number; total: number };
    intermediate: { completed: number; total: number };
    advanced: { completed: number; total: number };
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    unlockedAt: Date;
    icon: string;
  }[];
  weeklyGoal: number; // challenges per week
  monthlyStats: {
    month: string; // YYYY-MM format
    challengesCompleted: number;
    averageScore: number;
    topSkill: string;
  }[];
  joinedAt: Date;
  lastActive: Date;
}

const MentorProgressSchema = new Schema<IMentorProgress>(
  {
    userId: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    totalChallenges: { type: Number, default: 0 },
    completedChallenges: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastChallengeDate: { type: Date },
    skillScores: {
      javascript: { type: Number, default: 0 },
      react: { type: Number, default: 0 },
      typescript: { type: Number, default: 0 },
      css: { type: Number, default: 0 },
      nextjs: { type: Number, default: 0 },
      node: { type: Number, default: 0 },
      general: { type: Number, default: 0 },
    },
    difficultyProgress: {
      beginner: {
        completed: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      intermediate: {
        completed: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      advanced: {
        completed: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    },
    achievements: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        unlockedAt: { type: Date, required: true },
        icon: { type: String, required: true },
      },
    ],
    weeklyGoal: { type: Number, default: 3 },
    monthlyStats: [
      {
        month: { type: String, required: true }, // YYYY-MM
        challengesCompleted: { type: Number, required: true },
        averageScore: { type: Number, required: true },
        topSkill: { type: String, required: true },
      },
    ],
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "joinedAt", updatedAt: "lastActive" } }
);

// Index for faster queries
MentorProgressSchema.index({ userId: 1 });
MentorProgressSchema.index({ userEmail: 1 });
MentorProgressSchema.index({ lastActive: -1 });

export default models.MentorProgress ||
  mongoose.model<IMentorProgress>("MentorProgress", MentorProgressSchema);
