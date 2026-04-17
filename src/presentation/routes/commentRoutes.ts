import { Router } from "express";
import { CommentController } from "../controllers/CommentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Create comment (protected)
router.post("/posts/:postId/comments", authMiddleware, CommentController.createComment);

// Get comments for a post
router.get("/posts/:postId/comments", CommentController.getComments);

// Update comment (protected)
router.patch("/comments/:id", authMiddleware, CommentController.updateComment);

// Delete comment (protected)
router.delete("/comments/:id", authMiddleware, CommentController.deleteComment);

export default router;