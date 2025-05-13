import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isBanned: boolean;
  lastLogin?: {
    date: Date;
    ip: string;
  };
  loginHistory: {
    date: Date;
    ip: string;
  }[];
  resetCode?: string;
  resetCodeExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isBanned: { type: Boolean, default: false },
  lastLogin: {
    date: { type: Date, default: null },
    ip: { type: String, default: "" },
  },
  loginHistory: {
    type: [
      {
        date: { type: Date, required: true },
        ip: { type: String, required: true },
      },
    ],
    default: [],
  },
  resetCode: { type: String, default: null }, // Store reset code
  resetCodeExpires: { type: Date, default: null }, // Store reset code expiration time
});

export default models.User || mongoose.model<IUser>("User", UserSchema);
