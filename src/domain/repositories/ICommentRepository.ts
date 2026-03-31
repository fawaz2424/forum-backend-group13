export interface ICommentRepository {
  createComment(data: { content: string; userId: string; postId: string }): Promise<any>;
  getCommentsByPost(postId: string): Promise<any[]>;
  updateComment(id: string, content: string): Promise<any | null>;
  deleteComment(id: string): Promise<any | null>;
}