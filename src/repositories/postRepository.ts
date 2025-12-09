import { PostModel, IPost } from "../models/postModel";
import { BaseRepository } from "./baseRepository";

export class PostRepository extends BaseRepository<IPost> {
  constructor() {
    super(PostModel);
  }
}
