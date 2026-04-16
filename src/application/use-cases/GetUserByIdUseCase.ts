import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      message: "User fetched successfully",
      data: user,
    };
  }
}