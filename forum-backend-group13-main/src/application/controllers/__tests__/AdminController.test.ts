import { AdminController } from "../AdminController";
import { GetAllUsersUseCase } from "../../use-cases/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../../use-cases/GetUserByIdUseCase";
import { UpdateUserRoleUseCase } from "../../use-cases/UpdateUserRoleUseCase";
import { GetPlatformStatsUseCase } from "../../use-cases/GetPlatformStatsUseCase";
import { UnlockUserUseCase } from "../../use-cases/UnlockUserUseCase";

jest.mock("../../use-cases/GetAllUsersUseCase");
jest.mock("../../use-cases/GetUserByIdUseCase");
jest.mock("../../use-cases/UpdateUserRoleUseCase");
jest.mock("../../use-cases/GetPlatformStatsUseCase");
jest.mock("../../use-cases/UnlockUserUseCase");

describe("AdminController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { id: "admin-1", role: "admin" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should fetch all users successfully", async () => {
      const mockUsers = [
        { id: "1", name: "David", email: "david@test.com", role: "user" },
        { id: "2", name: "Admin", email: "admin@test.com", role: "admin" },
      ];

      (GetAllUsersUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockUsers),
      }));

      await AdminController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Users fetched successfully",
        data: mockUsers,
      });
    });

    it("should return 500 if fetching users fails", async () => {
      (GetAllUsersUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("Failed to fetch users")),
      }));

      await AdminController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to fetch users",
      });
    });
  });

  describe("getUserById", () => {
    it("should fetch one user successfully", async () => {
      req.params.id = "user-1";

      const mockResult = {
        message: "User fetched successfully",
        data: { id: "user-1", name: "David", role: "user" },
      };

      (GetUserByIdUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockResult),
      }));

      await AdminController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User fetched successfully",
        data: mockResult.data,
      });
    });

    it("should return 400 if user id is missing", async () => {
      req.params.id = undefined;

      await AdminController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User ID is required",
      });
    });

    it("should return 404 if user is not found", async () => {
      req.params.id = "missing-user";

      (GetUserByIdUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("User not found")),
      }));

      await AdminController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });
  });

  describe("updateUserRole", () => {
    it("should update user role successfully", async () => {
      req.params.id = "user-1";
      req.body = { role: "admin" };

      const mockResult = {
        message: "User role updated successfully",
        data: { id: "user-1", role: "admin" },
      };

      (UpdateUserRoleUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockResult),
      }));

      await AdminController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User role updated successfully",
        data: mockResult.data,
      });
    });

    it("should return 400 if user id is missing", async () => {
      req.params.id = undefined;
      req.body = { role: "admin" };

      await AdminController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User ID is required",
      });
    });

    it("should return 400 if role is missing", async () => {
      req.params.id = "user-1";
      req.body = {};

      await AdminController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Role is required",
      });
    });

    it("should return 400 if role is invalid", async () => {
      req.params.id = "user-1";
      req.body = { role: "manager" };

      await AdminController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid role provided",
      });
    });

    it("should return 400 if update role fails", async () => {
      req.params.id = "user-1";
      req.body = { role: "admin" };

      (UpdateUserRoleUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("Failed to update role")),
      }));

      await AdminController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to update role",
      });
    });
  });

  describe("unlockUser", () => {
    it("should unlock user successfully", async () => {
      req.params.id = "user-1";

      const mockResult = {
        message: "User unlocked successfully",
        data: { id: "user-1", isLocked: false, failedLoginAttempts: 0 },
      };

      (UnlockUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockResult),
      }));

      await AdminController.unlockUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User unlocked successfully",
        data: mockResult.data,
      });
    });

    it("should return 400 if user id is missing", async () => {
      req.params.id = undefined;

      await AdminController.unlockUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User ID is required",
      });
    });

    it("should return 400 if unlock fails", async () => {
      req.params.id = "user-1";

      (UnlockUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("User not found")),
      }));

      await AdminController.unlockUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });
  });

  describe("getPlatformStats", () => {
    it("should fetch platform stats successfully", async () => {
      const mockResult = {
        message: "Platform stats fetched successfully",
        data: {
          totalUsers: 10,
          totalPosts: 20,
          totalComments: 35,
          totalLikes: 50,
        },
      };

      (GetPlatformStatsUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockResult),
      }));

      await AdminController.getPlatformStats(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Platform stats fetched successfully",
        data: mockResult.data,
      });
    });

    it("should return 500 if stats fetch fails", async () => {
      (GetPlatformStatsUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("Failed to fetch platform stats")),
      }));

      await AdminController.getPlatformStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to fetch platform stats",
      });
    });
  });
});