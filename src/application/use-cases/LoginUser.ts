import { IUserRepository } from "../../domain/repositories/IUserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.isLocked) {
      throw new Error("Account is locked. Please contact admin to unlock it.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const updatedUser = await this.userRepository.incrementFailedLoginAttempts(user.id!);

      if (updatedUser && updatedUser.failedLoginAttempts >= 3) {
        await this.userRepository.lockUser(user.id!);
        throw new Error("Account locked after 3 failed login attempts");
      }

      throw new Error("Invalid email or password");
    }

    await this.userRepository.resetFailedLoginAttempts(user.id!);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}