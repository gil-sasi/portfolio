import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import CodeSubmission from "../../../models/CodeSubmission";
import Challenge from "../../../models/Challenge";
import { connectToDatabase } from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "my_very_secret_key_12345";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const {
      challengeId,
      code,
      language,
      submissionMethod,
      githubUrl,
      pastebinUrl,
      notes,
    } = req.body;

    // Validate required fields
    if (!challengeId || !code || !language || !submissionMethod) {
      return res.status(400).json({
        message:
          "Missing required fields: challengeId, code, language, submissionMethod",
      });
    }

    // Verify challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Get user info from token (if provided)
    let userId = "anonymous";
    let userEmail = "";
    let userName = "Anonymous User";

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded) {
          userId = decoded.id;
          userEmail = decoded.email || "";
          userName = `${decoded.firstName} ${decoded.lastName}`;
        }
      } catch (error) {
        // Continue as anonymous user if token is invalid
        console.log("Invalid token, continuing as anonymous user");
      }
    }

    // Validate submission method specific fields
    if (submissionMethod === "github" && !githubUrl) {
      return res
        .status(400)
        .json({ message: "GitHub URL is required for GitHub submissions" });
    }

    if (submissionMethod === "pastebin" && !pastebinUrl) {
      return res
        .status(400)
        .json({ message: "Pastebin URL is required for Pastebin submissions" });
    }

    // Validate language
    const validLanguages = [
      "javascript",
      "typescript",
      "react",
      "html",
      "css",
      "other",
    ];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({ message: "Invalid language specified" });
    }

    // Validate code length (prevent abuse)
    if (code.length > 50000) {
      return res
        .status(400)
        .json({ message: "Code submission too large (max 50KB)" });
    }

    // Check if user has already submitted for this challenge
    const existingSubmission = await CodeSubmission.findOne({
      userId,
      challengeId,
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: "You have already submitted code for this challenge",
        submissionId: existingSubmission._id,
      });
    }

    // Create new submission
    const submission = new CodeSubmission({
      userId,
      challengeId,
      code,
      language,
      submissionMethod,
      githubUrl: githubUrl || null,
      pastebinUrl: pastebinUrl || null,
      notes: notes || null,
      userEmail,
      userName,
      isReviewed: false,
    });

    await submission.save();

    // Trigger async review process (don't wait for completion)
    triggerCodeReview(submission._id.toString()).catch((error) => {
      console.error("Error triggering code review:", error);
    });

    res.status(201).json({
      success: true,
      message:
        "Code submitted successfully! Your review will be ready in a few minutes.",
      submission: {
        id: submission._id,
        challengeId: submission.challengeId,
        submittedAt: submission.submittedAt,
        isReviewed: submission.isReviewed,
        language: submission.language,
        submissionMethod: submission.submissionMethod,
      },
    });
  } catch (error) {
    console.error("Error in submit-code API:", error);
    res.status(500).json({
      message: "Failed to submit code",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

// Async function to trigger code review
async function triggerCodeReview(submissionId: string) {
  try {
    // Call the review API endpoint
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/mentor/review-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissionId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Review API error: ${response.status}`);
    }

    console.log(
      "Code review triggered successfully for submission:",
      submissionId
    );
  } catch (error) {
    console.error("Error triggering code review:", error);
    // Could implement retry logic or queue system here
  }
}
