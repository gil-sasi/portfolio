import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import BackgammonScore from "@/models/BackgammonScore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();

    if (req.method === "GET") {
      // Get leaderboard
      const { limit = 50, player } = req.query;

      let query = {};
      if (player) {
        query = { playerName: player };
      }

      const scores = await BackgammonScore.find(query)
        .sort({ date: -1 })
        .limit(parseInt(limit as string))
        .lean();

      // Calculate player statistics
      const playerStats = await BackgammonScore.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$playerName",
            totalGames: { $sum: 1 },
            wins: {
              $sum: {
                $cond: [{ $eq: ["$winner", "player"] }, 1, 0],
              },
            },
            losses: {
              $sum: {
                $cond: [{ $eq: ["$winner", "opponent"] }, 1, 0],
              },
            },
            avgDuration: { $avg: "$gameDuration" },
            avgMoves: { $avg: "$moveCount" },
            lastPlayed: { $max: "$date" },
          },
        },
        { $sort: { wins: -1, totalGames: -1 } },
        { $limit: parseInt(limit as string) },
      ]);

      res.status(200).json({
        success: true,
        scores,
        playerStats,
      });
    } else if (req.method === "POST") {
      // Save new score
      const {
        playerName,
        opponentName,
        winner,
        gameMode,
        gameDuration,
        moveCount,
        playerSocketId,
        gameRoomId,
      } = req.body;

      // Validate required fields
      if (
        !playerName ||
        !opponentName ||
        !winner ||
        !gameMode ||
        !gameDuration
      ) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      // Check for duplicate game (prevent spam)
      if (playerSocketId && gameRoomId) {
        const existingScore = await BackgammonScore.findOne({
          playerSocketId,
          gameRoomId,
          createdAt: { $gte: new Date(Date.now() - 60000) }, // Within last minute
        });

        if (existingScore) {
          return res.status(409).json({
            success: false,
            error: "Score already recorded for this game",
          });
        }
      }

      const newScore = new BackgammonScore({
        playerName: playerName.trim(),
        opponentName: opponentName.trim(),
        winner,
        gameMode,
        gameDuration,
        moveCount: moveCount || 0,
        playerSocketId,
        gameRoomId,
      });

      const savedScore = await newScore.save();

      res.status(201).json({
        success: true,
        score: savedScore,
      });
    } else {
      res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }
  } catch (error) {
    console.error("Backgammon scores API error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
