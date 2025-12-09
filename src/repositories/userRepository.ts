import { UserModel, IUser } from "../models/userModel";
import { BaseRepository } from "./baseRepository";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }
}
