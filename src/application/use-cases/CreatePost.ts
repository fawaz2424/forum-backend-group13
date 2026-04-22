import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class CreatePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(data: { title: string; content: string; userId: string }) {
    return await this.postRepository.createPost(data);
  }
}