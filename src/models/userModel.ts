import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  refreshTokens?: Array<string>;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
});

export const UserModel = mongoose.model<IUser>("User", userSchema);
