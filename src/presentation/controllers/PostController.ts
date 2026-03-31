import { Request, Response } from "express";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { CreatePost } from "../../application/use-cases/CreatePost";
import { GetPosts } from "../../application/use-cases/GetPosts";
import { GetPostById } from "../../application/use-cases/GetPostById";
import { UpdatePost } from "../../application/use-cases/UpdatePost";
import { DeletePost } from "../../application/use-cases/DeletePost";

const postRepository = new PostRepository();

export class PostController {
  static async createPost(req: Request, res: Response) {
    try {
      const useCase = new CreatePost(postRepository);
      const post = await useCase.execute({
        title: req.body.title,
        content: req.body.content,
        userId: (req as any).user.id,
      });
      res.status(201).json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Error creating post" });
    }
  }

  static async getPosts(req: Request, res: Response) {
    try {
      const useCase = new GetPosts(postRepository);
      const posts = await useCase.execute();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Error fetching posts" });
    }
  }

  static async getPostById(req: Request, res: Response) {
    try {
      const useCase = new GetPostById(postRepository);
      const post = await useCase.execute((req.params as any).id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Error fetching post" });
    }
  }

  static async updatePost(req: Request, res: Response) {
    try {
      const useCase = new UpdatePost(postRepository);
      const post = await useCase.execute(
        (req.params as any).id,
        (req as any).user.id,
        { title: req.body.title, content: req.body.content }
      );
      res.json(post);
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Error updating post" });
    }
  }

  static async deletePost(req: Request, res: Response) {
    try {
      const useCase = new DeletePost(postRepository);
      await useCase.execute((req.params as any).id, (req as any).user.id);
      res.json({ message: "Post deleted successfully" });
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Error deleting post" });
    }
  }
}