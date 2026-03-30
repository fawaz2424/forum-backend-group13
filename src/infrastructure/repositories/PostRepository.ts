import { PostModel } from "../database/models/PostModel";

export class PostRepository {
  async createPost(data: { title: string; content: string; userId: string }) {
    return await PostModel.create(data);
  }

  async getAllPosts() {
    return await PostModel.find().sort({ createdAt: -1 });
  }

  async getPostById(id: string) {
    return await PostModel.findById(id);
  }

  async updatePost(id: string, data: { title?: string; content?: string }) {
    return await PostModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePost(id: string) {
    return await PostModel.findByIdAndDelete(id);
  }
}