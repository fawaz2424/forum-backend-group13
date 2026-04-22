import { ILikeRepository } from "../../domain/repositories/ILikeRepository";

export class UnlikeCommentUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(userId: string, commentId: string) {
    const existingLike = await this.likeRepository.findOne(
      userId,
      commentId,
      "comment"
    );

    if (!existingLike) {
      throw new Error("You have not liked this comment");
    }

    const deleted = await this.likeRepository.delete(
      userId,
      commentId,
      "comment"
    );

    if (!deleted) {
      throw new Error("Failed to unlike comment");
    }

    return {
      message: "Comment unliked successfully",
    };
  }
}