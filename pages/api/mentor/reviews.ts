import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import CodeReview from "../../../models/CodeReview";
import CodeSubmission from "../../../models/CodeSubmission";
import Challenge from "../../../models/Challenge";
import { connectToDatabase } from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "my_very_secret_key_12345";

const getUserFromToken = (req: NextApiRequest) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const user = getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { limit = 10, offset = 0 } = req.query;

    // Get user's reviews with challenge and submission info
    const reviews = await CodeReview.find({ userId: user.id })
      .sort({ reviewedAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string));

    // Get related submissions and challenges
    const submissionIds = reviews.map((r) => r.submissionId);
    const challengeIds = reviews.map((r) => r.challengeId);

    const submissions = await CodeSubmission.find({
      _id: { $in: submissionIds },
    });

    const challenges = await Challenge.find({
      _id: { $in: challengeIds },
    });

    // Combine the data
    const enrichedReviews = reviews.map((review) => {
      const submission = submissions.find(
        (s) => s._id.toString() === review.submissionId
      );
      const challenge = challenges.find(
        (c) => c._id.toString() === review.challengeId
      );

      return {
        id: review._id,
        overallScore: review.overallScore,
        feedback: review.feedback,
        codeQuality: review.codeQuality,
        careerTips: review.careerTips,
        nextSteps: review.nextSteps,
        resources: review.resources,
        reviewedAt: review.reviewedAt,
        aiModel: review.aiModel,
        challenge: challenge
          ? {
              id: challenge._id,
              title: challenge.title,
              difficulty: challenge.difficulty,
              category: challenge.category,
              technologies: challenge.technologies,
            }
          : null,
        submission: submission
          ? {
              id: submission._id,
              language: submission.language,
              submissionMethod: submission.submissionMethod,
              submittedAt: submission.submittedAt,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      reviews: enrichedReviews,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: await CodeReview.countDocuments({ userId: user.id }),
      },
    });
  } catch (error) {
    console.error("Error in reviews API:", error);
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}
