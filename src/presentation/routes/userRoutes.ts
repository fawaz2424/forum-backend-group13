import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", authMiddleware, (req: AuthRequest, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

export default router;