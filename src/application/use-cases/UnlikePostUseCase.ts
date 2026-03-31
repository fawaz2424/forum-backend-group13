import { ILikeRepository } from "../../domain/repositories/ILikeRepository";

export class UnlikePostUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(userId: string, postId: string) {
    const existingLike = await this.likeRepository.findOne(
      userId,
      postId,
      "post"
    );

    if (!existingLike) {
      throw new Error("You have not liked this post");
    }

    const deleted = await this.likeRepository.delete(userId, postId, "post");

    if (!deleted) {
      throw new Error("Failed to unlike post");
    }

    return {
      message: "Post unliked successfully",
    };
  }
}