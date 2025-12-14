import { Request, Response } from "express";
import { PostRepository } from "../repositories/postRepository";
import { Types } from "mongoose";

const postRepository = new PostRepository();

export class PostController {
  async create(req: Request, res: Response) {
    try {
      const { description, location, sender } = req.body;
      if (!description || !location || !sender) {
        return res
          .status(400)
          .json({ error: "description, location, and sender are required" });
      }

      const post = await postRepository.create({
        description,
        location,
        sender: new Types.ObjectId(sender),
      });
      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create post" });
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      const posts = await postRepository.getAll();
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get all posts" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const post = await postRepository.getById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get post by id" });
    }
  }

  async getBySender(req: Request, res: Response) {
    try {
      const senderId = req.query.senderId as string;
      if (!senderId)
        return res.status(400).json({ error: "senderId is required" });

      const posts = await postRepository.getBySender(senderId);
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get posts by sender" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedPost = await postRepository.update(req.params.id, req.body);
      res.status(200).json(updatedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update post" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deletedPost = await postRepository.delete(req.params.id);
      res.status(200).json(deletedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete post" });
    }
  }
}

export default new PostController();
