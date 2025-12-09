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
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUser>("User", userSchema);
