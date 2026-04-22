import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginUserUseCase } from "../LoginUser";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockUserRepository = {
  findByEmail: jest.fn(),
  incrementFailedLoginAttempts: jest.fn(),
  resetFailedLoginAttempts: jest.fn(),
  lockUser: jest.fn(),
};

describe("LoginUserUseCase", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, JWT_SECRET: "testsecret" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should login successfully with valid credentials", async () => {
    const foundUser = {
      id: "u1",
      name: "Fawaz",
      email: "fawaz@test.com",
      password: "hashedPassword",
      role: "user",
      failedLoginAttempts: 2,
      isLocked: false,
    };

    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");
    mockUserRepository.resetFailedLoginAttempts.mockResolvedValue({
      ...foundUser,
      failedLoginAttempts: 0,
    });

    const useCase = new LoginUserUseCase(mockUserRepository as any);
    const result = await useCase.execute("fawaz@test.com", "123456");

    expect(mockUserRepository.resetFailedLoginAttempts).toHaveBeenCalledWith("u1");
    expect(result.token).toBe("mockToken");
    expect(result.user.email).toBe("fawaz@test.com");
  });

  it("should throw error if user does not exist", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const useCase = new LoginUserUseCase(mockUserRepository as any);

    await expect(
      useCase.execute("missing@test.com", "123456")
    ).rejects.toThrow("Invalid email or password");
  });

  it("should increment failed attempts for wrong password", async () => {
    const foundUser = {
      id: "u1",
      name: "Fawaz",
      email: "fawaz@test.com",
      password: "hashedPassword",
      role: "user",
      failedLoginAttempts: 0,
      isLocked: false,
    };

    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    mockUserRepository.incrementFailedLoginAttempts.mockResolvedValue({
      ...foundUser,
      failedLoginAttempts: 1,
    });

    const useCase = new LoginUserUseCase(mockUserRepository as any);

    await expect(
      useCase.execute("fawaz@test.com", "wrongpass")
    ).rejects.toThrow("Invalid email or password");

    expect(mockUserRepository.incrementFailedLoginAttempts).toHaveBeenCalledWith("u1");
  });

  it("should lock account after 3 failed attempts", async () => {
    const foundUser = {
      id: "u1",
      name: "Fawaz",
      email: "fawaz@test.com",
      password: "hashedPassword",
      role: "user",
      failedLoginAttempts: 2,
      isLocked: false,
    };

    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    mockUserRepository.incrementFailedLoginAttempts.mockResolvedValue({
      ...foundUser,
      failedLoginAttempts: 3,
    });
    mockUserRepository.lockUser.mockResolvedValue({
      ...foundUser,
      failedLoginAttempts: 3,
      isLocked: true,
    });

    const useCase = new LoginUserUseCase(mockUserRepository as any);

    await expect(
      useCase.execute("fawaz@test.com", "wrongpass")
    ).rejects.toThrow("Account locked after 3 failed login attempts");

    expect(mockUserRepository.lockUser).toHaveBeenCalledWith("u1");
  });

  it("should reject login if account is already locked", async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: "u1",
      name: "Fawaz",
      email: "fawaz@test.com",
      password: "hashedPassword",
      role: "user",
      failedLoginAttempts: 3,
      isLocked: true,
    });

    const useCase = new LoginUserUseCase(mockUserRepository as any);

    await expect(
      useCase.execute("fawaz@test.com", "123456")
    ).rejects.toThrow("Account is locked. Please contact admin to unlock it.");
  });
});

it("should throw error if JWT_SECRET is missing", async () => {
  process.env.JWT_SECRET = "";

  const foundUser = {
    id: "u1",
    name: "Fawaz",
    email: "fawaz@test.com",
    password: "hashedPassword",
    role: "user",
    failedLoginAttempts: 0,
    isLocked: false,
  };

  mockUserRepository.findByEmail.mockResolvedValue(foundUser);
  (bcrypt.compare as jest.Mock).mockResolvedValue(true);

  const useCase = new LoginUserUseCase(mockUserRepository as any);

  await expect(
    useCase.execute("fawaz@test.com", "123456")
  ).rejects.toThrow("JWT_SECRET is not defined");
});