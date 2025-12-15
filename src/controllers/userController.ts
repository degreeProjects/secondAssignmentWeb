import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";

const userRepository = new UserRepository();

export class UserController {
  async getAll(_req: Request, res: Response) {
    try {
      const users = await userRepository.getAll();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get all users" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await userRepository.getById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get user by id" });
    }
  }

  async getByEmail(req: Request, res: Response) {
    try {
      const user = await userRepository.getByEmail(req.params.email);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get user by email" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedUser = await userRepository.update(req.params.id, req.body);
      if (!updatedUser)
        return res.status(404).json({ error: "User not found" });
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update user" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deletedUser = await userRepository.delete(req.params.id);
      if (!deletedUser)
        return res.status(404).json({ error: "User not found" });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
}

export default new UserController();
