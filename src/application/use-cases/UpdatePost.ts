import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class UpdatePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: string, userId: string, data: { title?: string; content?: string }) {
    const post = await this.postRepository.getPostById(id);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("Unauthorized: you can only edit your own posts");
    }

    return await this.postRepository.updatePost(id, data);
  }
}