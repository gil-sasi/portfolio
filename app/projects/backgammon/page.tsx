"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";

export default function BackgammonPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    if (user) {
      setPlayerName(`${user.firstName} ${user.lastName}`.trim());
    }
  }, [user]);

  const handleJoinGame = () => {
    if (playerName.trim()) {
      router.push(
        `/projects/backgammon/lobby?name=${encodeURIComponent(playerName)}`
      );
    }
  };

  const handlePlayOffline = () => {
    if (playerName.trim()) {
      router.push(
        `/projects/backgammon/game?mode=offline&name=${encodeURIComponent(
          playerName
        )}`
      );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="gradient-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {t("backgammon", "Backgammon")}
              </span>
            </h1>
            <p className="text-lg text-gray-300">
              {t(
                "backgammon.description",
                "Play the classic backgammon game online with other players or practice offline"
              )}
            </p>
          </div>
        </div>

        {/* Game Entry Form */}
        <div className="modern-card p-8 max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {t("backgammon.enterGame", "Enter Game")}
          </h2>

          <div className="max-w-md mx-auto space-y-6">
            {!user && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t("backgammon.playerName", "Player Name")}
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={t("backgammon.enterName", "Enter your name")}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-800 text-white"
                  maxLength={20}
                />
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleJoinGame}
                disabled={!playerName.trim()}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 glow-hover"
              >
                <span>🎮</span>
                <span>{t("backgammon.playOnline", "Play Online")}</span>
              </button>

              <button
                onClick={handlePlayOffline}
                disabled={!playerName.trim()}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>🤖</span>
                <span>{t("backgammon.practiceOffline", "Practice vs AI")}</span>
              </button>

              <button
                onClick={() => router.push("/projects/backgammon/leaderboard")}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 glow-hover"
              >
                <span>🏆</span>
                <span>{t("backgammon.leaderboard", "Leaderboard")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="modern-card p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {t("backgammon.howToPlay", "How to Play")}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-400">
                {t("backgammon.objective", "Objective")}
              </h3>
              <p className="text-gray-300">
                {t(
                  "backgammon.objectiveText",
                  "Move all your checkers into your home board and then bear them off before your opponent does."
                )}
              </p>

              <h3 className="text-lg font-semibold text-amber-400">
                {t("backgammon.movement", "Movement")}
              </h3>
              <p className="text-gray-300">
                {t(
                  "backgammon.movementText",
                  "Roll two dice and move your checkers according to the numbers rolled. Each die represents a separate move."
                )}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-400">
                {t("backgammon.capture", "Capturing")}
              </h3>
              <p className="text-gray-300">
                {t(
                  "backgammon.captureText",
                  "If you land on a point with only one opponent checker, you capture it and send it to the bar."
                )}
              </p>

              <h3 className="text-lg font-semibold text-amber-400">
                {t("backgammon.bearingOff", "Bearing Off")}
              </h3>
              <p className="text-gray-300">
                {t(
                  "backgammon.bearingOffText",
                  "Once all your checkers are in your home board, you can start bearing them off the board."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
