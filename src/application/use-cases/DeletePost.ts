import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class DeletePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: string, userId: string) {
    const post = await this.postRepository.getPostById(id);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("Unauthorized: you can only delete your own posts");
    }

    return await this.postRepository.deletePost(id);
  }
}