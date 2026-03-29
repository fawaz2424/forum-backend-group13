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
}