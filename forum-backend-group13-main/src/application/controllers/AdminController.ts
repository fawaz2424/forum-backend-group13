 import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { GetAllUsersUseCase } from "../use-cases/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../use-cases/GetUserByIdUseCase";
import { UpdateUserRoleUseCase } from "../use-cases/UpdateUserRoleUseCase";
import { MongoLikeRepository } from "../../infrastructure/repositories/MongoLikeRepository";
import { GetPlatformStatsUseCase } from "../use-cases/GetPlatformStatsUseCase";
import { UnlockUserUseCase } from "../use-cases/UnlockUserUseCase";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export class AdminController {
  static async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const userRepository = new UserRepository();
      const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

      const result = await getAllUsersUseCase.execute();

      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch users",
      });
    }
  }

  static async getUserById(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const userRepository = new UserRepository();
      const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

      const result = await getUserByIdUseCase.execute(userId);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Failed to fetch user",
      });
    }
  }

  static async updateUserRole(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id as string;
      const { role } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Role is required",
        });
      }

      const allowedRoles = ["user", "admin", "superuser"];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role provided",
        });
      }

      const userRepository = new UserRepository();
      const updateUserRoleUseCase = new UpdateUserRoleUseCase(userRepository);

      const result = await updateUserRoleUseCase.execute(userId, role);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update user role",
      });
    }
  }

  static async unlockUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const userRepository = new UserRepository();
      const unlockUserUseCase = new UnlockUserUseCase(userRepository);

      const result = await unlockUserUseCase.execute(userId);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to unlock user",
      });
    }
  }

  static async getPlatformStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userRepository = new UserRepository();
      const likeRepository = new MongoLikeRepository();
      const getPlatformStatsUseCase = new GetPlatformStatsUseCase(
        userRepository,
        likeRepository
      );

      const result = await getPlatformStatsUseCase.execute();

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch platform stats",
      });
    }
  }
}