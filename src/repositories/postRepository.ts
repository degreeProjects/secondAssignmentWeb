import { PostModel, IPost } from "../models/postModel";
import { BaseRepository } from "./baseRepository";
import { Types } from "mongoose";

export class PostRepository extends BaseRepository<IPost> {
  constructor() {
    super(PostModel);
  }

  async getBySender(
    senderId: string | Types.ObjectId
  ): Promise<IPost[] | null> {
    return await this.model.find({ sender: senderId });
  }
}
