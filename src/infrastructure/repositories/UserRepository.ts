import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserModel } from "../database/models/UserModel";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create(user);

    return {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      password: createdUser.password,
      role: createdUser.role
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return null;
    }

    return {
      id: foundUser._id.toString(),
      name: foundUser.name,
      email: foundUser.email,
      password: foundUser.password,
      role: foundUser.role
    };
  }
}