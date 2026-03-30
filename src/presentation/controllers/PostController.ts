import { Request, Response } from "express";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";

const repo = new PostRepository();

export class PostController {
  static async createPost(req: Request, res: Response) {
    try {
      const post = await repo.createPost({
        title: req.body.title,
        content: req.body.content,
        userId: (req as any).user.id,
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Error creating post" });
    }
  }

  static async getPosts(req: Request, res: Response) {
    try {
      const posts = await repo.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts" });
    }
  }

  static async getPostById(req: Request, res: Response) {
    try {
      const post = await repo.getPostById((req.params as any).id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching post" });
    }
  }

  static async updatePost(req: Request, res: Response) {
    try {
      const post = await repo.updatePost((req.params as any).id, {
        title: req.body.title,
        content: req.body.content,
      });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error updating post" });
    }
  }

  static async deletePost(req: Request, res: Response) {
    try {
      const post = await repo.deletePost((req.params as any).id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting post" });
    }
  }
}