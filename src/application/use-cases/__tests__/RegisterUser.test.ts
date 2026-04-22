import bcrypt from "bcryptjs";
import { RegisterUserUseCase } from "../RegisterUser";

jest.mock("bcryptjs");

const mockUserRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  incrementFailedLoginAttempts: jest.fn(),
  resetFailedLoginAttempts: jest.fn(),
  lockUser: jest.fn(),
  unlockUser: jest.fn(),
};

describe("RegisterUserUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const createdUser = {
      id: "u1",
      name: "Fawaz",
      email: "fawaz@test.com",
      password: "hashedPassword",
      role: "user",
      failedLoginAttempts: 0,
      isLocked: false,
    };

    mockUserRepository.create.mockResolvedValue(createdUser);

    const useCase = new RegisterUserUseCase(mockUserRepository as any);
    const result = await useCase.execute("Fawaz", "fawaz@test.com", "123456");

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("fawaz@test.com");
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        failedLoginAttempts: 0,
        isLocked: false,
      })
    );
    expect(result).toEqual(createdUser);
  });

  it("should throw error if user already exists", async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: "u1",
      email: "fawaz@test.com",
    });

    const useCase = new RegisterUserUseCase(mockUserRepository as any);

    await expect(
      useCase.execute("Fawaz", "fawaz@test.com", "123456")
    ).rejects.toThrow("User already exists");
  });
});