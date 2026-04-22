import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class GetPostById {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: string) {
    return await this.postRepository.getPostById(id);
  }
}