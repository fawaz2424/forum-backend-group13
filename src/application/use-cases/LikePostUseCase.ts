import { ILikeRepository } from "../../domain/repositories/ILikeRepository";

export class LikePostUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(userId: string, postId: string) {
    const existingLike = await this.likeRepository.findOne(userId, postId, "post");

    if (existingLike) {
      throw new Error("You have already liked this post");
    }

    const like = await this.likeRepository.create({
      userId,
      targetId: postId,
      targetType: "post",
    });

    return {
      message: "Post liked successfully",
      data: like,
    };
  }
} 