import { ICommentRepository } from "../../domain/repositories/ICommentRepository";

export class DeleteComment {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(id: string, userId: string) {
    const comment = await this.commentRepository.getCommentById(id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("Unauthorized: you can only delete your own comments");
    }

    return await this.commentRepository.deleteComment(id);
  }
}