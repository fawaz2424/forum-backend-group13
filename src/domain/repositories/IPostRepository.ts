export interface IPostRepository {
  createPost(data: { title: string; content: string; userId: string }): Promise<any>;
  getAllPosts(): Promise<any[]>;
  getPostById(id: string): Promise<any | null>;
  updatePost(id: string, data: { title?: string; content?: string }): Promise<any | null>;
  deletePost(id: string): Promise<any | null>;
}