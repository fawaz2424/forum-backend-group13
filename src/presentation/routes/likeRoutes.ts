import { Router } from "express";
import { LikeController } from "../controllers/LikeController";

const router = Router();

router.post("/posts/:postId/like", LikeController.likePost);
router.delete("/posts/:postId/like", LikeController.unlikePost);
router.post("/comments/:commentId/like", LikeController.likeComment);
router.delete("/comments/:commentId/like", LikeController.unlikeComment);

export default router;