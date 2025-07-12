import { NextApiRequest, NextApiResponse } from "next";
import MentorProgress from "../../../models/MentorProgress";
import CodeSubmission from "../../../models/CodeSubmission";
import CodeReview from "../../../models/CodeReview";
import Challenge from "../../../models/Challenge";
import { connectToDatabase } from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "my_very_secret_key_12345";

// Achievement definitions
const achievements = [
  {
    id: "first_challenge",
    title: "First Steps",
    description: "Complete your first challenge",
    icon: "🎯",
  },
  {
    id: "streak_3",
    title: "On Fire",
    description: "Complete 3 challenges in a row",
    icon: "🔥",
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Complete 7 challenges in a row",
    icon: "⚡",
  },
  {
    id: "perfect_score",
    title: "Perfect 10",
    description: "Get a perfect 10 score on a challenge",
    icon: "🌟",
  },
  {
    id: "beginner_master",
    title: "Beginner Master",
    description: "Complete 10 beginner challenges",
    icon: "🥉",
  },
  {
    id: "intermediate_master",
    title: "Intermediate Master",
    description: "Complete 10 intermediate challenges",
    icon: "🥈",
  },
  {
    id: "advanced_master",
    title: "Advanced Master",
    description: "Complete 10 advanced challenges",
    icon: "🥇",
  },
  {
    id: "react_specialist",
    title: "React Specialist",
    description: "Complete 5 React challenges",
    icon: "⚛️",
  },
  {
    id: "js_guru",
    title: "JavaScript Guru",
    description: "Complete 5 JavaScript challenges",
    icon: "📜",
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Complete a challenge in under 15 minutes",
    icon: "💨",
  },
];

interface JWTPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const getUserFromToken = (req: NextApiRequest) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};

interface ProgressData {
  completedChallenges: number;
  currentStreak: number;
  difficultyProgress?: {
    beginner?: { completed: number };
    intermediate?: { completed: number };
    advanced?: { completed: number };
  };
  achievements?: { id: string }[];
}

interface ReviewData {
  overallScore: number;
}

const calculateAchievements = (
  progress: ProgressData,
  submissions: unknown[],
  reviews: ReviewData[]
) => {
  const newAchievements = [];
  const currentAchievements = progress.achievements || [];
  const currentIds = currentAchievements.map((a) => a.id);

  // First challenge
  if (
    progress.completedChallenges >= 1 &&
    !currentIds.includes("first_challenge")
  ) {
    newAchievements.push({
      ...achievements.find((a) => a.id === "first_challenge"),
      unlockedAt: new Date(),
    });
  }

  // Streak achievements
  if (progress.currentStreak >= 3 && !currentIds.includes("streak_3")) {
    newAchievements.push({
      ...achievements.find((a) => a.id === "streak_3"),
      unlockedAt: new Date(),
    });
  }

  if (progress.currentStreak >= 7 && !currentIds.includes("streak_7")) {
    newAchievements.push({
      ...achievements.find((a) => a.id === "streak_7"),
      unlockedAt: new Date(),
    });
  }

  // Perfect score
  const perfectScores = reviews.filter((r) => r.overallScore === 10);
  if (perfectScores.length > 0 && !currentIds.includes("perfect_score")) {
    newAchievements.push({
      ...achievements.find((a) => a.id === "perfect_score"),
      unlockedAt: new Date(),
    });
  }

  // Difficulty masters
  const difficultyProgress = progress.difficultyProgress || {};
  if (
    difficultyProgress.beginner?.completed &&
    difficultyProgress.beginner.completed >= 10 &&
    !currentIds.includes("beginner_master")
  ) {
    newAchievements.push({
      ...achievements.find((a) => a.id === "beginner_master"),
      unlockedAt: new Date(),
    });
  }

  if (
    difficultyProgress.intermediate?.completed &&
    difficultyProgress.intermediate.completed >= 10 &&
    !currentIds.includes("intermediate_master")
  ) {
    newAchievements.push({
      ...achievements.find((a) => a.id === "intermediate_master"),
      unlockedAt: new Date(),
    });
  }

  if (
    difficultyProgress.advanced?.completed &&
    difficultyProgress.advanced.completed >= 10 &&
    !currentIds.includes("advanced_master")
  ) {
    newAchievements.push({
      ...achievements.find((a) => a.id === "advanced_master"),
      unlockedAt: new Date(),
    });
  }

  return newAchievements;
};

const updateUserProgress = async (
  userId: string,
  userEmail: string,
  userName: string
) => {
  try {
    // Get all submissions for this user
    const submissions = await CodeSubmission.find({ userId }).sort({
      submittedAt: -1,
    });
    const reviewedSubmissions = submissions.filter((s) => s.isReviewed);

    // Get all reviews for this user
    const reviews = await CodeReview.find({ userId }).sort({ reviewedAt: -1 });

    // Get all challenges for context
    const challenges = await Challenge.find({
      _id: { $in: submissions.map((s) => s.challengeId) },
    });

    // Calculate stats
    const totalChallenges = submissions.length;
    const completedChallenges = reviewedSubmissions.length;
    const averageScore =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviews.length
        : 0;

    // Calculate skill scores
    const skillScores = {
      javascript: 0,
      react: 0,
      typescript: 0,
      css: 0,
      nextjs: 0,
      node: 0,
      general: 0,
    };

    const skillCounts = { ...skillScores };

    reviews.forEach((review) => {
      const challenge = challenges.find(
        (c) => c._id.toString() === review.challengeId
      );
      if (challenge && challenge.category in skillScores) {
        skillScores[challenge.category as keyof typeof skillScores] +=
          review.overallScore;
        skillCounts[challenge.category as keyof typeof skillCounts]++;
      }
    });

    // Average the skill scores
    Object.keys(skillScores).forEach((skill) => {
      const count = skillCounts[skill as keyof typeof skillCounts];
      if (count > 0) {
        skillScores[skill as keyof typeof skillScores] =
          skillScores[skill as keyof typeof skillScores] / count;
      }
    });

    // Calculate difficulty progress
    const difficultyProgress = {
      beginner: { completed: 0, total: 0 },
      intermediate: { completed: 0, total: 0 },
      advanced: { completed: 0, total: 0 },
    };

    challenges.forEach((challenge) => {
      const difficulty =
        challenge.difficulty as keyof typeof difficultyProgress;
      if (difficulty in difficultyProgress) {
        difficultyProgress[difficulty].total++;
        const isCompleted = reviewedSubmissions.some(
          (s) => s.challengeId === challenge._id.toString()
        );
        if (isCompleted) {
          difficultyProgress[difficulty].completed++;
        }
      }
    });

    // Calculate streak (simplified - would need better logic for real streak calculation)
    const currentStreak = Math.min(completedChallenges, 10); // Simplified
    const longestStreak = currentStreak;

    // Update or create progress record
    const progress = await MentorProgress.findOneAndUpdate(
      { userId },
      {
        $set: {
          userEmail,
          userName,
          totalChallenges,
          completedChallenges,
          averageScore,
          currentStreak,
          longestStreak,
          lastChallengeDate:
            reviewedSubmissions.length > 0
              ? reviewedSubmissions[0].submittedAt
              : null,
          skillScores,
          difficultyProgress,
          lastActive: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    // Calculate and add new achievements
    const newAchievements = calculateAchievements(
      progress,
      submissions,
      reviews
    );
    if (newAchievements.length > 0) {
      progress.achievements = [
        ...(progress.achievements || []),
        ...newAchievements,
      ];
      await progress.save();
    }

    return progress;
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw error;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();

    if (req.method === "GET") {
      // Get user progress
      const user = getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const progress = await updateUserProgress(
        user.id,
        user.email || "",
        `${user.firstName} ${user.lastName}`
      );

      res.status(200).json({
        success: true,
        progress,
      });
    } else if (req.method === "POST") {
      // Update weekly goal
      const user = getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { weeklyGoal } = req.body;
      if (!weeklyGoal || weeklyGoal < 1 || weeklyGoal > 20) {
        return res.status(400).json({ message: "Invalid weekly goal (1-20)" });
      }

      const progress = await MentorProgress.findOneAndUpdate(
        { userId: user.id },
        { $set: { weeklyGoal } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        progress,
      });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in progress API:", error);
    res.status(500).json({
      message: "Failed to manage progress",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}
