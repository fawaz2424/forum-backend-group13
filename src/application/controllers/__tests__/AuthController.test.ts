import { AuthController } from "../AuthController";
import { RegisterUserUseCase } from "../../use-cases/RegisterUser";
import { LoginUserUseCase } from "../../use-cases/LoginUser";

jest.mock("../../use-cases/RegisterUser");
jest.mock("../../use-cases/LoginUser");

describe("AuthController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register user successfully", async () => {
      const mockUser = {
        id: "u1",
        name: "Fawaz",
        email: "fawaz@test.com",
        role: "user",
        failedLoginAttempts: 0,
        isLocked: false,
      };

      req.body = {
        name: "Fawaz",
        email: "fawaz@test.com",
        password: "123456",
      };

      (RegisterUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockUser),
      }));

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: mockUser,
      });
    });

    it("should return 400 if registration fails", async () => {
      req.body = {
        name: "Fawaz",
        email: "fawaz@test.com",
        password: "123456",
      };

      (RegisterUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("User already exists")),
      }));

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "User already exists",
      });
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      const mockResult = {
        token: "mockToken",
        user: {
          id: "u1",
          name: "Fawaz",
          email: "fawaz@test.com",
          role: "user",
        },
      };

      req.body = {
        email: "fawaz@test.com",
        password: "123456",
      };

      (LoginUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockResult),
      }));

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        ...mockResult,
      });
    });

    it("should return 400 for invalid login", async () => {
      req.body = {
        email: "fawaz@test.com",
        password: "wrongpass",
      };

      (LoginUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(
          new Error("Invalid email or password")
        ),
      }));

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid email or password",
      });
    });

    it("should return 400 if account is locked", async () => {
      req.body = {
        email: "fawaz@test.com",
        password: "123456",
      };

      (LoginUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(
          new Error("Account is locked. Please contact admin to unlock it.")
        ),
      }));

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Account is locked. Please contact admin to unlock it.",
      });
    });
  });
});