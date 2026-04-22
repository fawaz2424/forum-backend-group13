import { Request, Response } from "express";
import { MongoLikeRepository } from "../../infrastructure/repositories/MongoLikeRepository";
import { LikePostUseCase } from "../use-cases/LikePostUseCase";
import { UnlikePostUseCase } from "../use-cases/UnlikePostUseCase";
import { LikeCommentUseCase } from "../use-cases/LikeCommentUseCase";
import { UnlikeCommentUseCase } from "../use-cases/UnlikeCommentUseCase";

export class LikeController {
  static async likePost(req: Request, res: Response) {
    try {
      const user = { id: "test-user-1" };
      const postId = req.params.postId as string;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const likeRepository = new MongoLikeRepository();
      const likePostUseCase = new LikePostUseCase(likeRepository);

      const result = await likePostUseCase.execute(user.id, postId);

      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to like post",
      });
    }
  }

  static async unlikePost(req: Request, res: Response) {
    try {
      const user = { id: "test-user-1" };
      const postId = req.params.postId as string;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const likeRepository = new MongoLikeRepository();
      const unlikePostUseCase = new UnlikePostUseCase(likeRepository);

      const result = await unlikePostUseCase.execute(user.id, postId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to unlike post",
      });
    }
  }

  static async likeComment(req: Request, res: Response) {
    try {
      const user = { id: "test-user-1" };
      const commentId = req.params.commentId as string;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const likeRepository = new MongoLikeRepository();
      const likeCommentUseCase = new LikeCommentUseCase(likeRepository);

      const result = await likeCommentUseCase.execute(user.id, commentId);

      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to like comment",
      });
    }
  }

  static async unlikeComment(req: Request, res: Response) {
    try {
      const user = { id: "test-user-1" };
      const commentId = req.params.commentId as string;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const likeRepository = new MongoLikeRepository();
      const unlikeCommentUseCase = new UnlikeCommentUseCase(likeRepository);

      const result = await unlikeCommentUseCase.execute(user.id, commentId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to unlike comment",
      });
    }
  }
}