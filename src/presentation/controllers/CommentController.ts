import { Request, Response } from "express";
import { CommentRepository } from "../../infrastructure/repositories/CommentRepository";

const repo = new CommentRepository();

export class CommentController {
  static async createComment(req: Request, res: Response) {
    try {
      const comment = await repo.createComment({
        content: req.body.content,
        userId: (req as any).user.id,
        postId: (req.params as any).postId,
      });

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Error creating comment" });
    }
  }

  static async getComments(req: Request, res: Response) {
    try {
      const comments = await repo.getCommentsByPost(
        (req.params as any).postId
      );

      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching comments" });
    }
  }

  static async updateComment(req: Request, res: Response) {
    try {
      const comment = await repo.updateComment(
        (req.params as any).id,
        req.body.content
      );

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: "Error updating comment" });
    }
  }

  static async deleteComment(req: Request, res: Response) {
    try {
      const comment = await repo.deleteComment(
        (req.params as any).id
      );

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment" });
    }
  }
}