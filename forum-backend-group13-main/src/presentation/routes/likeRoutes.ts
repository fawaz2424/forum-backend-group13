import { Router } from "express";
import { LikeController } from "../../application/controllers/LikeController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/posts/:postId/like", authMiddleware, LikeController.likePost);
router.delete("/posts/:postId/like", authMiddleware, LikeController.unlikePost);
router.post("/comments/:commentId/like", authMiddleware, LikeController.likeComment);
router.delete("/comments/:commentId/like", authMiddleware, LikeController.unlikeComment);

export default router;