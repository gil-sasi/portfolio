import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category?: string;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  category: { type: String },
});

export default mongoose.models.Skill ||
  mongoose.model<ISkill>("Skill", SkillSchema);
