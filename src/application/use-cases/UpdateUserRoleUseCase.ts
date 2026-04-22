import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class UpdateUserRoleUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, role: string) {
    const allowedRoles = ["user", "admin", "superuser"];

    if (!allowedRoles.includes(role)) {
      throw new Error("Invalid role");
    }

    const updatedUser = await this.userRepository.updateRole(id, role);

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return {
      message: "User role updated successfully",
      data: updatedUser,
    };
  }
}