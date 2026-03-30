import { CommentModel } from "../database/models/CommentModel";

export class CommentRepository {
  async createComment(data: {
    content: string;
    userId: string;
    postId: string;
  }) {
    return await CommentModel.create(data);
  }

  async getCommentsByPost(postId: string) {
    return await CommentModel.find({ postId }).sort({ createdAt: -1 });
  }

  async updateComment(id: string, content: string) {
    return await CommentModel.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
  }

  async deleteComment(id: string) {
    return await CommentModel.findByIdAndDelete(id);
  }
}