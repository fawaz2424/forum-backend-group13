import { ICommentRepository } from "../../domain/repositories/ICommentRepository";

export class GetComments {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(postId: string) {
    return await this.commentRepository.getCommentsByPost(postId);
  }
}