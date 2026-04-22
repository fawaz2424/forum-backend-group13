import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class UnlockUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const unlockedUser = await this.userRepository.unlockUser(userId);

    if (!unlockedUser) {
      throw new Error("Failed to unlock user");
    }

    return {
      message: "User unlocked successfully",
      data: unlockedUser,
    };
  }
}