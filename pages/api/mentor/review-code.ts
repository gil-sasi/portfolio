import { NextApiRequest, NextApiResponse } from "next";
import CodeSubmission from "../../../models/CodeSubmission";
import CodeReview from "../../../models/CodeReview";
import Challenge from "../../../models/Challenge";
import { connectToDatabase } from "../../../lib/mongodb";

interface ChallengeData {
  title: string;
  description: string;
  requirements: string[];
  difficulty: string;
}

const generateCodeReview = async (
  code: string,
  challenge: ChallengeData,
  language: string
) => {
  // Use fallback review system
  console.log("Using fallback review system");
  return getFallbackReview(challenge.difficulty, code);
};

const getFallbackReview = (difficulty: string, code: string = "") => {
  // Basic code quality analysis
  const codeLength = code.trim().length;
  const hasBasicStructure =
    code.includes("function") ||
    code.includes("const") ||
    code.includes("let") ||
    code.includes("var");
  const hasComments = code.includes("//") || code.includes("/*");
  const hasErrorHandling =
    code.includes("try") || code.includes("catch") || code.includes("throw");
  const hasConsoleLog = code.includes("console.log");
  const linesOfCode = code
    .split("\n")
    .filter((line) => line.trim().length > 0).length;

  // Enhanced gibberish and non-code detection
  const hasCodeKeywords =
    /\b(function|const|let|var|if|else|for|while|return|class|import|export|console|document|window)\b/i.test(
      code
    );
  const hasBrackets = /[(){}\[\]]/.test(code);
  const hasSemicolons = /[;]/.test(code);
  const hasAssignments = /[=]/.test(code);

  // Check if it's mostly non-Latin characters (like Hebrew, Arabic, etc.)
  const nonLatinChars = code.match(/[^\x00-\x7F]/g) || [];
  const nonLatinRatio = nonLatinChars.length / codeLength;

  // Check for repeated patterns (like "שדגשדגשדג")
  const hasRepeatedPatterns = /(.{3,})\1{3,}/.test(code);

  // Detect if this is likely gibberish or non-code
  const isLikelyGibberish =
    (!hasCodeKeywords &&
      !hasBrackets &&
      !hasSemicolons &&
      (nonLatinRatio > 0.8 || hasRepeatedPatterns)) ||
    (codeLength > 100 && !hasCodeKeywords && !hasBrackets && !hasAssignments);

  // Score based on code analysis
  let baseScore = 3; // Start with low score

  // Gibberish or non-code detection
  if (isLikelyGibberish) {
    baseScore = 0;
  }
  // Very short or empty code
  else if (codeLength < 20) {
    baseScore = 1;
  } else if (codeLength < 50) {
    baseScore = 2;
  } else if (hasBasicStructure) {
    baseScore = 4;
    if (linesOfCode > 5) baseScore += 1;
    if (hasComments) baseScore += 1;
    if (hasErrorHandling) baseScore += 1;
    if (!hasConsoleLog) baseScore += 0.5; // Bonus for not using console.log
  }

  // Cap the score based on difficulty
  const maxScore =
    difficulty === "beginner" ? 8 : difficulty === "intermediate" ? 7 : 6;
  baseScore = Math.min(baseScore, maxScore);

  // Generate feedback based on analysis
  const strengths = [];
  const improvements = [];
  const bugs = [];

  if (isLikelyGibberish) {
    improvements.push(
      "The submitted text appears to be non-code or gibberish - please provide actual code"
    );
    improvements.push(
      "Make sure to submit valid programming code that addresses the challenge"
    );
    bugs.push("Invalid or non-code submission detected");
  } else if (codeLength < 20) {
    improvements.push(
      "Code submission is too short - please provide a complete solution"
    );
    improvements.push(
      "Include proper variable declarations and function definitions"
    );
    bugs.push("Incomplete or missing implementation");
  } else {
    if (hasBasicStructure) {
      strengths.push("Code includes basic JavaScript structure");
    }
    if (hasComments) {
      strengths.push("Good use of comments for code documentation");
    }
    if (hasErrorHandling) {
      strengths.push("Includes error handling - excellent practice");
    }

    if (!hasComments && linesOfCode > 10) {
      improvements.push("Add comments to explain complex logic");
    }
    if (!hasErrorHandling) {
      improvements.push("Consider adding error handling for edge cases");
    }
    if (hasConsoleLog) {
      improvements.push("Remove console.log statements before production");
    }
  }

  if (strengths.length === 0) {
    if (isLikelyGibberish) {
      strengths.push("Thank you for your submission");
    } else {
      strengths.push("Thank you for submitting your code");
    }
  }

  if (improvements.length === 0) {
    improvements.push("Consider refactoring for better readability");
  }

  return {
    overallScore: Math.round(baseScore),
    feedback: {
      strengths,
      improvements,
      bugs,
      suggestions: [
        isLikelyGibberish
          ? "Please submit actual code that attempts to solve the challenge"
          : "Practice writing more complete solutions",
        "Focus on code structure and organization",
        "Add proper variable naming and comments",
      ],
    },
    codeQuality: {
      readability: Math.max(1, Math.round(baseScore - 1)),
      structure: Math.max(1, Math.round(baseScore - 0.5)),
      efficiency: Math.max(1, Math.round(baseScore - 1.5)),
      bestPractices: Math.max(1, Math.round(baseScore - 1)),
    },
    careerTips: [
      "Focus on writing clean, readable code - this is highly valued by employers",
      "Practice explaining your code to others to improve communication skills",
      isLikelyGibberish
        ? "Always submit valid code that demonstrates your programming skills"
        : "Always provide complete, working solutions to demonstrate your skills",
    ],
    nextSteps: [
      codeLength < 50 || isLikelyGibberish
        ? "Practice writing more complete code solutions"
        : "Continue practicing at this difficulty level",
      "Focus on code organization and structure",
      "Learn about testing and debugging techniques",
    ],
    resources: [
      {
        title: "Clean Code Principles",
        url: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html",
        type: "article",
      },
      {
        title: "JavaScript Best Practices",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        type: "documentation",
      },
    ],
    aiModel: "fallback-analyzed",
    reviewVersion: 1,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const { submissionId } = req.body;

    if (!submissionId) {
      return res.status(400).json({ message: "Missing submissionId" });
    }

    // Find the submission
    const submission = await CodeSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Check if already reviewed
    if (submission.isReviewed) {
      const existingReview = await CodeReview.findOne({ submissionId });
      if (existingReview) {
        return res.status(200).json({
          success: true,
          message: "Code already reviewed",
          review: existingReview,
        });
      }
    }

    // Get the challenge details
    const challenge = await Challenge.findById(submission.challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Generate AI review
    const reviewData = await generateCodeReview(
      submission.code,
      challenge,
      submission.language
    );

    // Save review to database
    const review = new CodeReview({
      submissionId: submission._id,
      userId: submission.userId,
      challengeId: submission.challengeId,
      ...reviewData,
    });

    await review.save();

    // Update submission as reviewed
    submission.isReviewed = true;
    submission.reviewId = review._id.toString();
    await submission.save();

    res.status(200).json({
      success: true,
      message: "Code review completed successfully",
      review: {
        id: review._id,
        overallScore: review.overallScore,
        feedback: review.feedback,
        codeQuality: review.codeQuality,
        careerTips: review.careerTips,
        nextSteps: review.nextSteps,
        resources: review.resources,
        reviewedAt: review.reviewedAt,
      },
    });
  } catch (error) {
    console.error("Error in review-code API:", error);
    res.status(500).json({
      message: "Failed to generate code review",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}
