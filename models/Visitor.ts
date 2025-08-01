import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  firstVisit: { type: Date, default: Date.now },
  country: { type: String, default: "Unknown" },
  userAgent: { type: String, default: "" },
  referrer: { type: String, default: "" },
  isValidVisitor: { type: Boolean, default: true },
});

export default mongoose.models.Visitor ||
  mongoose.model("Visitor", visitorSchema);
