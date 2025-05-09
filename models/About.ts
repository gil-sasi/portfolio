import mongoose, { Schema, Document, models } from "mongoose";

interface IAbout extends Document {
  content: string;
}

const AboutSchema = new Schema<IAbout>({
  content: { type: String, required: true },
});

export default models.About || mongoose.model<IAbout>("About", AboutSchema);
