"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Types
interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  requirements: string[];
  hints: string[];
  technologies: string[];
  estimatedTime: number;
  exampleCode?: string;
  createdAt: string;
}

interface CodeReview {
  id: string;
  overallScore: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    bugs: string[];
    suggestions: string[];
  };
  codeQuality: {
    readability: number;
    structure: number;
    efficiency: number;
    bestPractices: number;
  };
  careerTips: string[];
  nextSteps: string[];
  resources: {
    title: string;
    url: string;
    type: string;
  }[];
  reviewedAt: string;
}

interface Progress {
  completedChallenges: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  skillScores: {
    javascript: number;
    react: number;
    typescript: number;
    css: number;
    nextjs: number;
    node: number;
    general: number;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

// API functions
const fetchProgress = async (token: string | null) => {
  if (!token) {
    console.warn("No authentication token available, skipping progress fetch");
    return { progress: null };
  }

  const response = await fetch("/api/mentor/progress", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.warn("Authentication token expired or invalid");
      localStorage.removeItem("token"); // Clear invalid token
      return { progress: null };
    }
    throw new Error("Failed to fetch progress");
  }

  return response.json();
};

const generateChallengeAPI = async (data: {
  difficulty: string;
  category: string;
  userId?: string;
}) => {
  const response = await fetch("/api/mentor/challenge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to generate challenge";
    try {
      const error = await response.json();
      errorMessage = error.message || error.error || errorMessage;
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const submitCodeAPI = async (data: {
  challengeId: string;
  code: string;
  language: string;
  submissionMethod: string;
  githubUrl?: string;
  pastebinUrl?: string;
  notes: string;
  token?: string;
}) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (data.token) {
    headers.Authorization = `Bearer ${data.token}`;
  }

  const response = await fetch("/api/mentor/submit-code", {
    method: "POST",
    headers,
    body: JSON.stringify({
      challengeId: data.challengeId,
      code: data.code,
      language: data.language,
      submissionMethod: data.submissionMethod,
      githubUrl: data.githubUrl,
      pastebinUrl: data.pastebinUrl,
      notes: data.notes,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit code");
  }

  return response.json();
};

const reviewCodeAPI = async (submissionId: string) => {
  const response = await fetch("/api/mentor/review-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ submissionId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get review");
  }

  return response.json();
};

export default function MentorPage() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "challenge" | "submit" | "progress"
  >("challenge");

  // Challenge state
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");
  const [selectedCategory, setSelectedCategory] = useState<string>("react");

  // Code submission state
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submissionMethod, setSubmissionMethod] = useState("direct");
  const [githubUrl, setGithubUrl] = useState("");
  const [pastebinUrl, setPastebinUrl] = useState("");
  const [notes, setNotes] = useState("");

  // Review state
  const [currentReview, setCurrentReview] = useState<CodeReview | null>(null);

  // Modal state
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showAcceptModal) {
        setShowAcceptModal(false);
      }
    };

    if (showAcceptModal) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showAcceptModal]);

  // React Query hooks
  const {
    data: progressData,
    isLoading: loadingProgress,
    refetch: refetchProgress,
    error: progressError,
  } = useQuery({
    queryKey: ["mentor-progress", user?.id],
    queryFn: () => fetchProgress(localStorage.getItem("token")),
    enabled: !!user && mounted && !!localStorage.getItem("token"),
    retry: false, // Don't retry if token is missing
  });

  // Handle progress error
  useEffect(() => {
    if (progressError) {
      console.error("Error fetching progress:", progressError);
      // Only show error toast for actual server errors, not auth issues
      if (
        progressError.message !== "No token provided" &&
        !progressError.message.includes("401")
      ) {
        toast.error(t("failedToLoadProgress"));
      }
    }
  }, [progressError, t]);

  const progress = progressData?.progress || null;

  const generateChallengeMutation = useMutation({
    mutationFn: generateChallengeAPI,
    onSuccess: (data) => {
      setCurrentChallenge(data.challenge);
      setActiveTab("challenge");
      setModalMessage(t("newChallengeGenerated"));
      setShowAcceptModal(true);
    },
    onError: (error: Error) => {
      console.error("Error generating challenge:", error);
      toast.error(t("failedToGenerateChallenge"));
    },
  });

  const submitCodeMutation = useMutation({
    mutationFn: submitCodeAPI,
    onSuccess: (data) => {
      setModalMessage(t("codeSubmittedSuccessfully"));
      setShowAcceptModal(true);

      // Clear form and previous review
      setCode("");
      setNotes("");
      setGithubUrl("");
      setPastebinUrl("");
      setCurrentReview(null);

      // Start checking for review (fallback system should be quick)
      pollForReview(data.submission.id);
    },
    onError: (error: Error) => {
      console.error("Error submitting code:", error);
      toast.error(error.message || t("failedToSubmitCode"));
    },
  });

  const reviewCodeMutation = useMutation({
    mutationFn: reviewCodeAPI,
    onSuccess: (data) => {
      if (data.success) {
        setCurrentReview(data.review);
        setActiveTab("submit");
        // Only show modal if this is a new review (not from polling)
        if (!currentReview) {
          setModalMessage(t("reviewReady"));
          setShowAcceptModal(true);
        }
        refetchProgress(); // Update progress
      } else {
        console.log("Review not ready yet, continuing to wait...");
      }
    },
    onError: (error: Error) => {
      console.error("Error getting review:", error);
      toast.error(`Review error: ${error.message}`);
    },
  });

  const generateChallenge = useCallback(() => {
    generateChallengeMutation.mutate({
      difficulty: selectedDifficulty,
      category: selectedCategory,
      userId: user?.id,
    });
  }, [
    selectedDifficulty,
    selectedCategory,
    user?.id,
    generateChallengeMutation,
  ]);

  const submitCode = useCallback(() => {
    if (!currentChallenge || !code.trim()) {
      toast.error(t("provideCodeSolution"));
      return;
    }

    submitCodeMutation.mutate({
      challengeId: currentChallenge.id,
      code,
      language,
      submissionMethod,
      githubUrl: submissionMethod === "github" ? githubUrl : undefined,
      pastebinUrl: submissionMethod === "pastebin" ? pastebinUrl : undefined,
      notes,
      token: localStorage.getItem("token") || undefined,
    });
  }, [
    currentChallenge,
    code,
    language,
    submissionMethod,
    githubUrl,
    pastebinUrl,
    notes,
    t,
    submitCodeMutation,
  ]);

  const pollForReview = useCallback(
    (submissionId: string) => {
      const maxAttempts = 8; // 1 minute max (since fallback is instant)
      let attempts = 0;

      const poll = () => {
        reviewCodeMutation.mutate(submissionId);

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 8000); // Poll every 8 seconds
        } else {
          toast.error("Review generation failed. Please try submitting again.");
          console.error("Review polling timed out after", attempts, "attempts");
        }
      };

      setTimeout(poll, 3000); // Start polling after 3 seconds
    },
    [reviewCodeMutation]
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "from-green-500 to-emerald-500";
      case "intermediate":
        return "from-yellow-500 to-orange-500";
      case "advanced":
        return "from-red-500 to-pink-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      react: "⚛️",
      javascript: "📜",
      typescript: "🔷",
      css: "🎨",
      nextjs: "▲",
      node: "🟢",
      general: "💻",
    };
    return icons[category] || "💻";
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="glass rounded-2xl p-6 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="gradient-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                {t("mentorPageTitle")}
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              {t("mentorPageDescription")}
            </p>

            {/* Stats bar */}
            {progress && (
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">{t("completedLabel")}</span>
                  <span className="font-semibold">
                    {progress.completedChallenges}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">{t("averageLabel")}</span>
                  <span className="font-semibold">
                    {progress.averageScore.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-400">{t("streakLabel")}</span>
                  <span className="font-semibold">
                    {progress.currentStreak}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Auth Check */}
        {!user && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="modern-card p-6 text-center border-l-4 border-yellow-500">
              <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">
                {t("loginRequired")}
              </h3>
              <p className="text-gray-400 mb-4">{t("loginRequiredDesc")}</p>
              <a
                href="/login"
                className="btn-primary px-6 py-2 rounded-lg font-medium glow-hover transition-all duration-300"
              >
                {t("loginToContinue")}
              </a>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[
              { id: "challenge", label: t("tabNewChallenge"), icon: "🎯" },
              { id: "submit", label: t("tabSubmitCode"), icon: "📝" },
              { id: "progress", label: t("tabProgress"), icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "challenge" | "submit" | "progress")
                }
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {/* Challenge Tab */}
          {activeTab === "challenge" && (
            <div className="space-y-6">
              {/* Challenge Generator */}
              <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-purple-400">🎯</span>
                  {t("generateNewChallenge")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("difficultyLevel")}
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) =>
                        setSelectedDifficulty(
                          e.target.value as
                            | "beginner"
                            | "intermediate"
                            | "advanced"
                        )
                      }
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="beginner">{t("beginner")}</option>
                      <option value="intermediate">{t("intermediate")}</option>
                      <option value="advanced">{t("advanced")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("technology")}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="react">{t("react")}</option>
                      <option value="javascript">{t("javascript")}</option>
                      <option value="typescript">{t("typescript")}</option>
                      <option value="css">{t("css")}</option>
                      <option value="nextjs">{t("nextjs")}</option>
                      <option value="node">{t("nodejs")}</option>
                      <option value="general">{t("general")}</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateChallenge}
                  disabled={generateChallengeMutation.isPending}
                  className="btn-primary px-6 py-3 rounded-lg font-semibold glow-hover transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generateChallengeMutation.isPending
                    ? t("generatingChallenge")
                    : t("generateChallenge")}
                </button>
              </div>

              {/* Current Challenge */}
              {currentChallenge && (
                <div className="modern-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">
                      {currentChallenge.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getDifficultyColor(
                          currentChallenge.difficulty
                        )} text-white`}
                      >
                        {currentChallenge.difficulty}
                      </span>
                      <span className="text-2xl">
                        {getCategoryIcon(currentChallenge.category)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">
                    {currentChallenge.description}
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 text-green-400">
                        {t("requirements")}
                      </h3>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {currentChallenge.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-yellow-400">
                        {t("hints")}
                      </h3>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {currentChallenge.hints.map((hint, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-400">
                      {t("technologiesLabel")}
                    </span>
                    {currentChallenge.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-gray-400">
                    {t("estimatedTime")} {currentChallenge.estimatedTime}{" "}
                    {t("estimatedTimeMinutes")}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab("submit")}
                      className="btn-secondary px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                    >
                      {t("submitYourSolution")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Tab */}
          {activeTab === "submit" && (
            <div className="space-y-6">
              {!currentChallenge ? (
                <div className="modern-card p-6 text-center">
                  <div className="text-gray-400 text-4xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("noActiveChallenge")}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {t("noActiveChallengeDesc")}
                  </p>
                  <button
                    onClick={() => setActiveTab("challenge")}
                    className="btn-primary px-6 py-2 rounded-lg font-medium"
                  >
                    {t("generateChallenge")}
                  </button>
                </div>
              ) : (
                <>
                  {/* Code Submission Form */}
                  <div className="modern-card p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <span className="text-blue-400">📝</span>
                      {t("submitYourSolutionTitle")}
                    </h2>

                    <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-semibold text-blue-400 mb-2">
                        {t("currentChallenge")}
                      </h3>
                      <p className="text-gray-300">{currentChallenge.title}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t("programmingLanguage")}
                          </label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="javascript">
                              {t("javascriptLang")}
                            </option>
                            <option value="typescript">
                              {t("typescriptLang")}
                            </option>
                            <option value="react">{t("reactLang")}</option>
                            <option value="html">{t("htmlLang")}</option>
                            <option value="css">{t("cssLang")}</option>
                            <option value="other">{t("otherLang")}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t("submissionMethod")}
                          </label>
                          <select
                            value={submissionMethod}
                            onChange={(e) =>
                              setSubmissionMethod(e.target.value)
                            }
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="direct">{t("directPaste")}</option>
                            <option value="github">{t("githubLink")}</option>
                            <option value="pastebin">
                              {t("pastebinLink")}
                            </option>
                          </select>
                        </div>
                      </div>

                      {submissionMethod === "github" && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t("githubRepositoryUrl")}
                          </label>
                          <input
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/username/repo"
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}

                      {submissionMethod === "pastebin" && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t("pastebinUrl")}
                          </label>
                          <input
                            type="url"
                            value={pastebinUrl}
                            onChange={(e) => setPastebinUrl(e.target.value)}
                            placeholder="https://pastebin.com/..."
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}

                      {submissionMethod === "direct" && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t("yourCode")}
                          </label>
                          <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder={t("yourCodePlaceholder")}
                            rows={12}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t("notes")}
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={t("notesPlaceholder")}
                          rows={3}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        onClick={submitCode}
                        disabled={
                          submitCodeMutation.isPending ||
                          (submissionMethod === "direct" && !code.trim())
                        }
                        className="btn-primary px-6 py-3 rounded-lg font-semibold glow-hover transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitCodeMutation.isPending
                          ? t("submittingCode")
                          : t("submitForReview")}
                      </button>
                    </div>
                  </div>

                  {/* Review Display */}
                  {currentReview && (
                    <div className="modern-card p-6">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-green-400">📋</span>
                        {t("codeReviewResults")}
                      </h2>

                      <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">
                              {currentReview.overallScore}/10
                            </div>
                            <div className="text-sm text-gray-400">
                              {t("overallScore")}
                            </div>
                          </div>
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                              <div className="text-lg font-semibold text-green-400">
                                {currentReview.codeQuality.readability}/10
                              </div>
                              <div className="text-xs text-gray-400">
                                {t("readability")}
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-blue-400">
                                {currentReview.codeQuality.structure}/10
                              </div>
                              <div className="text-xs text-gray-400">
                                {t("structure")}
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-yellow-400">
                                {currentReview.codeQuality.efficiency}/10
                              </div>
                              <div className="text-xs text-gray-400">
                                {t("efficiency")}
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-purple-400">
                                {currentReview.codeQuality.bestPractices}/10
                              </div>
                              <div className="text-xs text-gray-400">
                                {t("bestPractices")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-3 text-green-400 flex items-center gap-2">
                            <span>✅</span> {t("strengths")}
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-300">
                            {currentReview.feedback.strengths.map(
                              (strength, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-green-400 mt-1">•</span>
                                  {strength}
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3 text-yellow-400 flex items-center gap-2">
                            <span>🔧</span> {t("areasForImprovement")}
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-300">
                            {currentReview.feedback.improvements.map(
                              (improvement, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-yellow-400 mt-1">
                                    •
                                  </span>
                                  {improvement}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>

                      {currentReview.feedback.bugs.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-semibold mb-3 text-red-400 flex items-center gap-2">
                            <span>🐛</span> {t("potentialIssues")}
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-300">
                            {currentReview.feedback.bugs.map((bug, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <span className="text-red-400 mt-1">•</span>
                                {bug}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-6">
                        <h3 className="font-semibold mb-3 text-purple-400 flex items-center gap-2">
                          <span>💼</span> {t("careerTips")}
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                          {currentReview.careerTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-semibold mb-3 text-blue-400 flex items-center gap-2">
                          <span>📚</span> {t("recommendedResources")}
                        </h3>
                        <div className="space-y-2">
                          {currentReview.resources.map((resource, index) => (
                            <a
                              key={index}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-blue-400">
                                  {resource.type === "video"
                                    ? "📹"
                                    : resource.type === "tutorial"
                                    ? "📖"
                                    : resource.type === "documentation"
                                    ? "📋"
                                    : "📰"}
                                </span>
                                <span className="font-medium">
                                  {resource.title}
                                </span>
                                <span className="text-xs text-gray-400 capitalize">
                                  ({resource.type})
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === "progress" && (
            <div className="space-y-6">
              {!user ? (
                <div className="modern-card p-6 text-center">
                  <div className="text-gray-400 text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("loginRequired")}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {t("loginRequiredProgress")}
                  </p>
                  <a
                    href="/login"
                    className="btn-primary px-6 py-2 rounded-lg font-medium"
                  >
                    {t("loginNow")}
                  </a>
                </div>
              ) : loadingProgress ? (
                <div className="modern-card p-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-gray-400">{t("loadingProgress")}</p>
                </div>
              ) : progress ? (
                <>
                  {/* Progress Overview */}
                  <div className="modern-card p-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <span className="text-blue-400">📊</span>
                      {t("yourProgress")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-400 mb-2">
                          {progress.completedChallenges}
                        </div>
                        <div className="text-gray-400">
                          {t("challengesCompleted")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">
                          {progress.averageScore.toFixed(1)}
                        </div>
                        <div className="text-gray-400">{t("averageScore")}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-400 mb-2">
                          {progress.currentStreak}
                        </div>
                        <div className="text-gray-400">
                          {t("currentStreak")}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 text-purple-400">
                        {t("skillScores")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(progress.skillScores).map(
                          ([skill, score]) => {
                            const numScore = Number(score);
                            return (
                              <div
                                key={skill}
                                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                              >
                                <span className="capitalize flex items-center gap-2">
                                  {getCategoryIcon(skill)} {skill}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-2 bg-gray-700 rounded-full">
                                    <div
                                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${(numScore / 10) * 100}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium w-8 text-right">
                                    {numScore.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {progress.achievements.length > 0 && (
                    <div className="modern-card p-6">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-yellow-400">🏆</span>
                        {t("achievements")}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {progress.achievements.map(
                          (achievement: Achievement, index: number) => (
                            <div
                              key={index}
                              className="p-4 bg-gray-800/50 rounded-lg border border-yellow-500/30"
                            >
                              <div className="text-center">
                                <div className="text-3xl mb-2">
                                  {achievement.icon}
                                </div>
                                <h3 className="font-semibold text-yellow-400 mb-1">
                                  {achievement.title}
                                </h3>
                                <p className="text-sm text-gray-400 mb-2">
                                  {achievement.description}
                                </p>
                                <div className="text-xs text-gray-500">
                                  {new Date(
                                    achievement.unlockedAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="modern-card p-6 text-center">
                  <div className="text-gray-400 text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("noProgressYet")}
                  </h3>
                  <p className="text-gray-400 mb-4">{t("noProgressYetDesc")}</p>
                  <button
                    onClick={() => setActiveTab("challenge")}
                    className="btn-primary px-6 py-2 rounded-lg font-medium"
                  >
                    {t("startFirstChallenge")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAcceptModal(false)}
        >
          <div
            className="bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-green-400 text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {t("accepted")}
              </h3>
              <p className="text-gray-300 mb-4">{modalMessage}</p>
              <button
                onClick={() => setShowAcceptModal(false)}
                className="btn-primary px-6 py-2 rounded-lg font-medium w-full"
              >
                {t("ok")}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
