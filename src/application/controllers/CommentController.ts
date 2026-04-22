import { Request, Response } from "express";
import { CommentRepository } from "../../infrastructure/repositories/CommentRepository";
import { CreateComment } from "../use-cases/CreateComment";
import { GetComments } from "../use-cases/GetComments";
import { UpdateComment } from "../use-cases/UpdateComment";
import { DeleteComment } from "../use-cases/DeleteComment";

const commentRepository = new CommentRepository();

export class CommentController {
  static async createComment(req: Request, res: Response) {
    try {
      const useCase = new CreateComment(commentRepository);
      const comment = await useCase.execute({
        content: req.body.content,
        userId: (req as any).user.id,
        postId: (req.params as any).postId,
      });
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Error creating comment" });
    }
  }

  static async getComments(req: Request, res: Response) {
    try {
      const useCase = new GetComments(commentRepository);
      const comments = await useCase.execute((req.params as any).postId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Error fetching comments" });
    }
  }

  static async updateComment(req: Request, res: Response) {
    try {
      const useCase = new UpdateComment(commentRepository);
      const comment = await useCase.execute(
        (req.params as any).id,
        (req as any).user.id,
        req.body.content
      );
      res.json(comment);
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Error updating comment" });
    }
  }

  static async deleteComment(req: Request, res: Response) {
    try {
      const useCase = new DeleteComment(commentRepository);
      await useCase.execute((req.params as any).id, (req as any).user.id);
      res.json({ message: "Comment deleted successfully" });
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Error deleting comment" });
    }
  }
}