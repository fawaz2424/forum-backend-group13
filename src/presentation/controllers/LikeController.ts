import { Request, Response } from "express";
import { MongoLikeRepository } from "../../infrastructure/repositories/MongoLikeRepository";
import { LikePostUseCase } from "../../application/use-cases/LikePostUseCase";

export class LikeController {
  static async likePost(req: Request, res: Response) {
  try {
    // temporary user (for testing)
    const user = { id: "test-user-1" };

    // FIXED typing
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
}