import { Request, Response } from "express";
import { MongoLikeRepository } from "../../infrastructure/repositories/MongoLikeRepository";
import { LikePostUseCase } from "../use-cases/LikePostUseCase";
import { UnlikePostUseCase } from "../use-cases/UnlikePostUseCase";
import { LikeCommentUseCase } from "../use-cases/LikeCommentUseCase";
import { UnlikeCommentUseCase } from "../use-cases/UnlikeCommentUseCase";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}
export class LikeController {
  static async likePost(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const postId = req.params.postId as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const likeRepository = new MongoLikeRepository();
    const likePostUseCase = new LikePostUseCase(likeRepository);

    const result = await likePostUseCase.execute(userId, postId);

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
  static async unlikePost(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const postId = req.params.postId as string;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const likeRepository = new MongoLikeRepository();
      const unlikePostUseCase = new UnlikePostUseCase(likeRepository);

      const result = await unlikePostUseCase.execute(userId, postId);

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

  static async likeComment(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const commentId = req.params.commentId as string;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!commentId) {
        return res.status(400).json({
          success: false,
          message: "Comment ID is required",
        });
      }

      const likeRepository = new MongoLikeRepository();
      const likeCommentUseCase = new LikeCommentUseCase(likeRepository);

      const result = await likeCommentUseCase.execute(userId, commentId);

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

  static async unlikeComment(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const commentId = req.params.commentId as string;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!commentId) {
        return res.status(400).json({
          success: false,
          message: "Comment ID is required",
        });
      }

      const likeRepository = new MongoLikeRepository();
      const unlikeCommentUseCase = new UnlikeCommentUseCase(likeRepository);

      const result = await unlikeCommentUseCase.execute(userId, commentId);

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