"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import TrackProjectVisit from "../../../components/TrackProjectVisit";
import { useEffect, useState } from "react";

export default function DangerousGilHome() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const gameFeatures = [
    {
      icon: "🎮",
      title: "Action Adventure",
      description: "Fast-paced 2D platformer gameplay",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: "🏗️",
      title: "Level Editor",
      description: "Create and share custom levels",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "💎",
      title: "Collectibles",
      description: "Gather diamonds and power-ups",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: "👾",
      title: "Boss Battles",
      description: "Fight challenging enemies",
      color: "from-orange-500 to-yellow-500",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TrackProjectVisit
        projectId="dave-game"
        projectName="Dave's Adventure Game"
      />

      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-red-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-pink-500/10 rounded-full blur-xl"></div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-red-500 rounded-full opacity-20 float-animation"></div>
      <div
        className="absolute top-40 right-10 w-12 h-12 bg-pink-500 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors duration-300 group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("backToProjects")}
          </Link>

          {/* Header */}
          <div className="text-center">
            <div className="glass rounded-2xl p-8 max-w-3xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center text-3xl font-bold glow">
                🎮
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-red-400 via-pink-500 to-red-600 bg-clip-text text-transparent">
                  {t("gamename")}
                </span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {t("gamedescription")}
              </p>

              {/* Game Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/projects/dave-game/play"
                  className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg glow-hover transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  🎮 {t("newgame")}
                </Link>
                <Link
                  href="/projects/dave-game/editor"
                  className="btn-secondary px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 w-full sm:w-auto justify-center"
                >
                  🧱 {t("createlevel")}
                </Link>
              </div>
            </div>
          </div>

          {/* Game Features Section */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                🌟 {t("gameFeatures")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center text-xl">
                  🎮
                </div>
                <h3 className="font-semibold text-red-400 mb-2">
                  {t("actionAdventure")}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("fastPacedPlatformer")}
                </p>
              </div>
              <div className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-500/20 flex items-center justify-center text-xl">
                  🏗️
                </div>
                <h3 className="font-semibold text-pink-400 mb-2">
                  {t("levelEditor")}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("createShareLevels")}
                </p>
              </div>
              <div className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/20 flex items-center justify-center text-xl">
                  💎
                </div>
                <h3 className="font-semibold text-purple-400 mb-2">
                  {t("collectibles")}
                </h3>
                <p className="text-sm text-gray-400">{t("gatherDiamonds")}</p>
              </div>
              <div className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-500/20 flex items-center justify-center text-xl">
                  👾
                </div>
                <h3 className="font-semibold text-orange-400 mb-2">
                  {t("bossBattles")}
                </h3>
                <p className="text-sm text-gray-400">{t("fightEnemies")}</p>
              </div>
            </div>
          </div>

          {/* How to Play Section */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                🕹️ {t("howToUse")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
                  ⬅️➡️
                </div>
                <h3 className="font-semibold text-blue-400 mb-2">
                  {t("move")}
                </h3>
                <p className="text-sm text-gray-400">{t("useArrowKeys")}</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">
                  ⬆️
                </div>
                <h3 className="font-semibold text-green-400 mb-2">
                  {t("jump")}
                </h3>
                <p className="text-sm text-gray-400">{t("pressSpacebar")}</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center text-2xl">
                  🔫
                </div>
                <h3 className="font-semibold text-orange-400 mb-2">
                  {t("shoot")}
                </h3>
                <p className="text-sm text-gray-400">{t("pressCtrlToShoot")}</p>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="modern-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                🛠️ {t("builtWith")}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/20 flex items-center justify-center text-xl">
                  🎮
                </div>
                <h3 className="font-semibold text-purple-400 mb-2">
                  {t("gameEngine")}
                </h3>
                <div className="space-y-2">
                  <span className="inline-block bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full text-xs">
                    {t("customJavaScript")}
                  </span>
                  <span className="inline-block bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full text-xs ml-2">
                    {t("html5Canvas")}
                  </span>
                </div>
              </div>
              <div className="text-center p-6 glass rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-500/20 flex items-center justify-center text-xl">
                  🖥️
                </div>
                <h3 className="font-semibold text-pink-400 mb-2">
                  {t("frontend")}
                </h3>
                <div className="space-y-2">
                  <span className="inline-block bg-pink-500/10 text-pink-300 px-3 py-1 rounded-full text-xs">
                    {t("nextjsTypeScript")}
                  </span>
                  <span className="inline-block bg-pink-500/10 text-pink-300 px-3 py-1 rounded-full text-xs ml-2">
                    {t("typeScript")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
