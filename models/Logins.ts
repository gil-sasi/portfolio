import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  ip: { type: String },
});

export default mongoose.models.Login || mongoose.model("Login", loginSchema);
