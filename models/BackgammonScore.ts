import mongoose from "mongoose";

const BackgammonScoreSchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    opponentName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    winner: {
      type: String,
      required: true,
      enum: ["player", "opponent"],
    },
    gameMode: {
      type: String,
      required: true,
      enum: ["online", "offline"],
    },
    gameDuration: {
      type: Number, // in seconds
      required: true,
    },
    moveCount: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    playerSocketId: {
      type: String,
      required: false, // for tracking duplicate games
    },
    gameRoomId: {
      type: String,
      required: false, // for online games
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
BackgammonScoreSchema.index({ playerName: 1, date: -1 });
BackgammonScoreSchema.index({ date: -1 });

export default mongoose.models.BackgammonScore ||
  mongoose.model("BackgammonScore", BackgammonScoreSchema);
