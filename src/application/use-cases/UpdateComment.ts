import { ICommentRepository } from "../../domain/repositories/ICommentRepository";

export class UpdateComment {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(id: string, userId: string, content: string) {
    const comment = await this.commentRepository.getCommentById(id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("Unauthorized: you can only edit your own comments");
    }

    return await this.commentRepository.updateComment(id, content);
  }
}