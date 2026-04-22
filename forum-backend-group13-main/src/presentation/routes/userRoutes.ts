import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import { adminMiddleware } from ".././middleware/adminMiddleware";
import { AdminController } from "../../application/controllers/AdminController";

const router = Router();

router.get("/profile", authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

router.get("/admin/users", authMiddleware, adminMiddleware, AdminController.getAllUsers);
router.get("/admin/users/:id", authMiddleware, adminMiddleware, AdminController.getUserById);
router.patch("/admin/users/:id/role", authMiddleware, adminMiddleware, AdminController.updateUserRole);
router.patch("/admin/users/:id/unlock", authMiddleware, adminMiddleware, AdminController.unlockUser);
router.get("/admin/stats", authMiddleware, adminMiddleware, AdminController.getPlatformStats);

export default router;