"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface Score {
  _id: string;
  playerName: string;
  opponentName: string;
  winner: "player" | "opponent";
  gameMode: "online" | "offline";
  gameDuration: number;
  moveCount: number;
  date: string;
}

interface PlayerStats {
  _id: string;
  totalGames: number;
  wins: number;
  losses: number;
  avgDuration: number;
  avgMoves: number;
  lastPlayed: string;
}

export default function BackgammonLeaderboard() {
  const router = useRouter();
  const { t } = useTranslation();

  const [scores, setScores] = useState<Score[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"leaderboard" | "recentGames">(
    "leaderboard"
  );

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/backgammon/scores");
      const data = await response.json();

      if (data.success) {
        setScores(data.scores);
        setPlayerStats(data.playerStats);
      } else {
        setError(data.error || "Failed to fetch scores");
      }
    } catch (err) {
      setError("Failed to fetch scores");
      console.error("Error fetching scores:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateWinRate = (wins: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 animated-bg opacity-5"></div>
        <div className="pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">
              {t("backgammon.loadingScores", "Loading scores...")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 animated-bg opacity-5"></div>
        <div className="pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-gray-300 text-lg mb-4">{error}</p>
            <button
              onClick={() => router.push("/projects/backgammon")}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              {t("backgammon.backToMenu", "Back to Menu")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t("backgammon.leaderboard", "Leaderboard")}
              </h1>
              <p className="text-lg text-gray-300">
                {t(
                  "backgammon.leaderboardDescription",
                  "Top players and recent games"
                )}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mb-8">
            <div className="modern-card p-1">
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "leaderboard"
                    ? "bg-amber-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {t("backgammon.topPlayers", "Top Players")}
              </button>
              <button
                onClick={() => setActiveTab("recentGames")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "recentGames"
                    ? "bg-amber-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {t("backgammon.recentGames", "Recent Games")}
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "leaderboard" ? (
            <div className="modern-card overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {t("backgammon.topPlayers", "Top Players")}
                </h2>

                {playerStats.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎲</div>
                    <p className="text-gray-300 text-lg">
                      {t("backgammon.noGamesYet", "No games played yet")}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-amber-200 dark:border-amber-700">
                          <th className="text-left py-3 px-4 font-semibold text-amber-800 dark:text-amber-400">
                            {t("backgammon.rank", "Rank")}
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-amber-800 dark:text-amber-400">
                            {t("backgammon.player", "Player")}
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-amber-800 dark:text-amber-400">
                            {t("backgammon.wins", "Wins")}
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-amber-800 dark:text-amber-400">
                            {t("backgammon.losses", "Losses")}
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-amber-800 dark:text-amber-400">
                            {t("backgammon.winRate", "Win Rate")}
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-amber-800 dark:text-amber-400">
                            {t("backgammon.avgDuration", "Avg Duration")}
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-amber-800 dark:text-amber-400">
                            {t("backgammon.lastPlayed", "Last Played")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerStats.map((player, index) => (
                          <tr
                            key={player._id}
                            className="border-b border-amber-100 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-gray-700"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                {index < 3 && (
                                  <span className="text-2xl mr-2">
                                    {index === 0
                                      ? "🥇"
                                      : index === 1
                                      ? "🥈"
                                      : "🥉"}
                                  </span>
                                )}
                                <span className="font-bold text-amber-800 dark:text-amber-400">
                                  #{index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {player._id}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-green-600 dark:text-green-400 font-bold">
                                {player.wins}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-red-600 dark:text-red-400 font-bold">
                                {player.losses}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-amber-700 dark:text-amber-300">
                                {calculateWinRate(
                                  player.wins,
                                  player.totalGames
                                )}
                                %
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-gray-600 dark:text-gray-400">
                                {formatDuration(Math.round(player.avgDuration))}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-gray-600 dark:text-gray-400">
                                {formatDate(player.lastPlayed)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-400 mb-6">
                  {t("backgammon.recentGames", "Recent Games")}
                </h2>

                {scores.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎲</div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {t("backgammon.noGamesYet", "No games played yet")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scores.map((score) => (
                      <div
                        key={score._id}
                        className="bg-amber-50 dark:bg-gray-700 rounded-lg p-4 border border-amber-200 dark:border-amber-700"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-amber-800 dark:text-amber-400">
                                {score.playerName}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                vs
                              </span>
                              <span className="font-bold text-amber-800 dark:text-amber-400">
                                {score.opponentName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  score.winner === "player"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }`}
                              >
                                {score.winner === "player"
                                  ? t("backgammon.won", "Won")
                                  : t("backgammon.lost", "Lost")}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  score.gameMode === "online"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                }`}
                              >
                                {score.gameMode === "online"
                                  ? t("backgammon.online", "Online")
                                  : t("backgammon.offline", "Offline")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{formatDuration(score.gameDuration)}</span>
                            <span>
                              {score.moveCount} {t("backgammon.moves", "moves")}
                            </span>
                            <span>{formatDate(score.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Back to Menu */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/projects/backgammon")}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {t("backgammon.backToMenu", "Back to Menu")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
