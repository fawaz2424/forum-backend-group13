import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { GetAllUsersUseCase } from "../../application/use-cases/GetAllUserUseCase";

export class AdminController {
  static async getAllUser(req: Request, res: Response) {
  try {
    const userRepository = new UserRepository();
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

    const result = await getAllUsersUseCase.execute();

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
}

  static async getUserById(req: Request, res: Response) {
    const userId = req.params.id as string;

    return res.status(200).json({
      success: true,
      message: "Get single user endpoint ready",
      data: {
        id: userId,
      },
    });
  }

  static async updateUserRole(req: Request, res: Response) {
    const userId = req.params.id as string;
    const { role } = req.body;

    return res.status(200).json({
      success: true,
      message: "Update user role endpoint ready",
      data: {
        id: userId,
        role,
      },
    });
  }

  static async toggleUserStatus(req: Request, res: Response) {
    const userId = req.params.id as string;
    const { isActive } = req.body;

    return res.status(200).json({
      success: true,
      message: "Toggle user status endpoint ready",
      data: {
        id: userId,
        isActive,
      },
    });
  }

  static async getPlatformStats(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      message: "Platform stats endpoint ready",
      data: {
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalPostLikes: 0,
        totalCommentLikes: 0,
      },
    });
  }
static async getAllUsers(req: Request, res: Response) {
  try {
    const userRepository = new UserRepository();
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

    const result = await getAllUsersUseCase.execute();

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
}
}