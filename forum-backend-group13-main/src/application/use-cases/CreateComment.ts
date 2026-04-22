import { ICommentRepository } from "../../domain/repositories/ICommentRepository";

export class CreateComment {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(data: { content: string; userId: string; postId: string }) {
    return await this.commentRepository.createComment(data);
  }
}