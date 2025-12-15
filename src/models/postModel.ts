import mongoose, { Document, Types, Schema } from "mongoose";

export interface IPost extends Document {
  description: string;
  location: string;
  sender: Types.ObjectId;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PostModel = mongoose.model<IPost>("Post", postSchema);
