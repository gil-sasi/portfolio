import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: String,
  visitedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Visitor ||
  mongoose.model("Visitor", visitorSchema);
