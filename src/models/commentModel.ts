import mongoose, { Document, Types, Schema } from "mongoose";

export interface IComment extends Document {
  content: string;
  post: Types.ObjectId;
  sender: Types.ObjectId;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
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

export const CommentModel = mongoose.model<IComment>("Comment", commentSchema);
