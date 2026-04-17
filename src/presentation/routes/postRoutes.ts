import { Router } from "express";
import { PostController } from "../../application/controllers/PostController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Create post (protected)
router.post("/", authMiddleware, PostController.createPost);

// Get all posts
router.get("/", PostController.getPosts);

// Get single post
router.get("/:id", PostController.getPostById);

// Update post (protected)
router.patch("/:id", authMiddleware, PostController.updatePost);

// Delete post (protected)
router.delete("/:id", authMiddleware, PostController.deletePost);

export default router;