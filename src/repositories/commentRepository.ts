import { CommentModel, IComment } from "../models/commentModel";
import { BaseRepository } from "./baseRepository";
import { Types } from "mongoose";

export class CommentRepository extends BaseRepository<IComment> {
  constructor() {
    super(CommentModel);
  }

  async getByPost(postId: string | Types.ObjectId): Promise<IComment[] | null> {
    return await this.model.find({ post: postId });
  }
}
