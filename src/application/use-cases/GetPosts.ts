import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class GetPosts {
  constructor(private postRepository: IPostRepository) {}

  async execute() {
    return await this.postRepository.getAllPosts();
  }
}