import { IUserRepository } from "../../domain/repositories/IUserRepository";
import bcrypt from "bcryptjs";

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      failedLoginAttempts: 0,
      isLocked: false,
    });

    return newUser;
  }
}