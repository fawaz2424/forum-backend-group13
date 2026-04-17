import bcrypt from "bcryptjs";
import { LoginUserUseCase } from "../application/use-cases/LoginUser";
import { RegisterUserUseCase } from "../application/use-cases/RegisterUser";

const mockUserRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  updateRole: jest.fn(),
  countAll: jest.fn(),
};

describe("Auth Use Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
  });

  it("should register user successfully", async () => {
    const userData = {
      id: "1",
      name: "Fawaz",
      email: "fawaz@test.com",
      password: "123456",
      role: "user",
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(userData);

    const useCase = new RegisterUserUseCase(mockUserRepository as any);
    const result = await useCase.execute(
      userData.name,
      userData.email,
      userData.password
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(result.email).toBe(userData.email);
  });

  it("should not register duplicate user", async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: "1",
      name: "Fawaz",
      email: "fawaz@test.com",
      password: "hashedpassword",
      role: "user",
    });

    const useCase = new RegisterUserUseCase(mockUserRepository as any);

    await expect(
      useCase.execute("Fawaz", "fawaz@test.com", "123456")
    ).rejects.toThrow("User already exists");
  });

  it("should login successfully", async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    mockUserRepository.findByEmail.mockResolvedValue({
      id: "1",
      name: "Fawaz",
      email: "fawaz@test.com",
      password: hashedPassword,
      role: "user",
    });

    const useCase = new LoginUserUseCase(mockUserRepository as any);
    const result = await useCase.execute("fawaz@test.com", "123456");

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("fawaz@test.com");
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("fawaz@test.com");
  });

  it("should throw error if user does not exist", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const useCase = new LoginUserUseCase(mockUserRepository as any);

    await expect(
      useCase.execute("nouser@test.com", "123456")
    ).rejects.toThrow("Invalid email or password");
  });

  it("should throw error if password is wrong", async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    mockUserRepository.findByEmail.mockResolvedValue({
      id: "1",
      name: "Fawaz",
      email: "fawaz@test.com",
      password: hashedPassword,
      role: "user",
    });

    const useCase = new LoginUserUseCase(mockUserRepository as any);

    await expect(
      useCase.execute("fawaz@test.com", "wrongpassword")
    ).rejects.toThrow("Invalid email or password");
  });

  it("should throw error if JWT_SECRET is missing", async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    mockUserRepository.findByEmail.mockResolvedValue({
      id: "1",
      name: "Fawaz",
      email: "fawaz@test.com",
      password: hashedPassword,
      role: "user",
    });

    delete process.env.JWT_SECRET;

    const useCase = new LoginUserUseCase(mockUserRepository as any);

    await expect(
      useCase.execute("fawaz@test.com", "123456")
    ).rejects.toThrow("JWT_SECRET is not defined");
  });
});