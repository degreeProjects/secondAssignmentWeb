import { Request, Response } from "express";
import { CommentRepository } from "../repositories/commentRepository";
import { Types } from "mongoose";

const commentRepository = new CommentRepository();

export class CommentController {
  async create(req: Request, res: Response) {
    try {
      const { content, post, sender } = req.body;

      if (!content || !post || !sender) {
        return res
          .status(400)
          .json({ error: "content, post, and sender are required" });
      }

      const comment = await commentRepository.create({
        content,
        post: new Types.ObjectId(post),
        sender: new Types.ObjectId(sender),
      });

      res.status(200).json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create comment" });
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      const comments = await commentRepository.getAll();
      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get all comments" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const comment = await commentRepository.getById(req.params.id);
      if (!comment) return res.status(404).json({ error: "Comment not found" });
      res.status(200).json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get comment by id" });
    }
  }

  async getByPost(req: Request, res: Response) {
    try {
      const comments = await commentRepository.getByPost(req.params.postId);
      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get comments by post" });
    }
  }

  async getBySender(req: Request, res: Response) {
    try {
      const comments = await commentRepository.getBySender(req.params.senderId);
      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get comments by sender" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedComment = await commentRepository.update(
        req.params.id,
        req.body
      );
      if (!updatedComment)
        return res.status(404).json({ error: "Comment not found" });
      res.status(200).json(updatedComment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update comment" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deletedComment = await commentRepository.delete(req.params.id);
      if (!deletedComment)
        return res.status(404).json({ error: "Comment not found" });
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
}

export default new CommentController();
