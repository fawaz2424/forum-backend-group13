import { ILikeRepository } from "../../domain/repositories/ILikeRepository";

export class LikeCommentUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(userId: string, commentId: string) {
    const existingLike = await this.likeRepository.findOne(
      userId,
      commentId,
      "comment"
    );

    if (existingLike) {
      throw new Error("You have already liked this comment");
    }

    const like = await this.likeRepository.create({
      userId,
      targetId: commentId,
      targetType: "comment",
    });

    return {
      message: "Comment liked successfully",
      data: like,
    };
  }
}