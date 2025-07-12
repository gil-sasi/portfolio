import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import CodeSubmission from "../../../models/CodeSubmission";
import CodeReview from "../../../models/CodeReview";
import Challenge from "../../../models/Challenge";
import { connectToDatabase } from "../../../lib/mongodb";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

const generateCodeReview = async (
  code: string,
  challenge: any,
  language: string
) => {
  // Try Hugging Face API first
  if (HUGGING_FACE_API_KEY) {
    try {
      console.log("Using Hugging Face API for code review");
      return await getHuggingFaceReview(code, challenge, language);
    } catch (error) {
      console.error("Hugging Face API error:", error);
      console.log("Falling back to local review system");
    }
  } else {
    console.log("No Hugging Face API key found, using fallback review");
  }

  // Fallback to local review
  return getFallbackReview(challenge.difficulty, code, challenge);
};

const getHuggingFaceReview = async (
  code: string,
  challenge: any,
  language: string
) => {
  const prompt = `You are a senior developer conducting a code review. Analyze this code and provide feedback in JSON format.

CHALLENGE:
Title: ${challenge.title}
Description: ${challenge.description}
Requirements: ${challenge.requirements.join(", ")}
Difficulty: ${challenge.difficulty}

CODE (${language}):
${code}

Please respond with ONLY a JSON object in this exact format:
{
  "overallScore": number (0-10),
  "feedback": {
    "strengths": ["specific strength 1", "specific strength 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "bugs": ["bug 1", "bug 2"],
    "suggestions": ["suggestion 1", "suggestion 2"]
  },
  "codeQuality": {
    "readability": number (0-10),
    "structure": number (0-10),
    "efficiency": number (0-10),
    "bestPractices": number (0-10)
  },
  "careerTips": ["tip 1", "tip 2"],
  "nextSteps": ["step 1", "step 2"],
  "resources": [
    {
      "title": "Resource Title",
      "url": "https://example.com",
      "type": "article"
    }
  ]
}

Be honest about code quality. If code is gibberish, non-functional, or doesn't attempt to solve the challenge, give it 0-2 points.`;

  // Using Mistral-7B-Instruct model which is good for code analysis
  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
    {
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.3,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Hugging Face API error: ${response.status} - ${errorText}`
    );
  }

  const result = await response.json();
  let generatedText = "";

  // Handle different response formats
  if (Array.isArray(result) && result.length > 0) {
    generatedText = result[0].generated_text || result[0].text || "";
  } else if (result.generated_text) {
    generatedText = result.generated_text;
  } else if (result.text) {
    generatedText = result.text;
  } else {
    throw new Error("Unexpected response format from Hugging Face");
  }

  // Extract JSON from the response
  let jsonMatch = generatedText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    // Sometimes the model outputs JSON without proper formatting
    jsonMatch = generatedText.match(/\{[^}]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from AI response");
    }
  }

  try {
    const parsedReview = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (
      !parsedReview.overallScore ||
      !parsedReview.feedback ||
      !parsedReview.codeQuality
    ) {
      throw new Error("Invalid response structure from AI");
    }

    return {
      ...parsedReview,
      aiModel: "mistral-7b-instruct",
      reviewVersion: 1,
    };
  } catch (parseError) {
    console.error("Error parsing AI response:", parseError);
    console.log("Raw AI response:", generatedText);
    throw new Error("Failed to parse AI response");
  }
};

const getFallbackReview = (
  difficulty: string,
  code: string = "",
  challenge: any = null
) => {
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
  const hasOperators = /[+\-*/%<>!&|]/.test(code);

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
