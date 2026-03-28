import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import bcrypt from "bcryptjs";

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = {
      name,
      email,
      password: hashedPassword,
      role: "user"
    };

    return await this.userRepository.create(user);
  }
}