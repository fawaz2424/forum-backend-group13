import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../database/models/UserModel";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create(user);

    return {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      password: createdUser.password,
      role: createdUser.role,
      failedLoginAttempts: createdUser.failedLoginAttempts,
      isLocked: createdUser.isLocked,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      failedLoginAttempts: user.failedLoginAttempts,
      isLocked: user.isLocked,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      failedLoginAttempts: user.failedLoginAttempts,
      isLocked: user.isLocked,
    };
  }

  async incrementFailedLoginAttempts(userId: string): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { failedLoginAttempts: 1 } },
      { new: true }
    );

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      failedLoginAttempts: user.failedLoginAttempts,
      isLocked: user.isLocked,
    };
  }

  async resetFailedLoginAttempts(userId: string): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { failedLoginAttempts: 0 },
      { new: true }
    );

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      failedLoginAttempts: user.failedLoginAttempts,
      isLocked: user.isLocked,
    };
  }

  async lockUser(userId: string): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isLocked: true },
      { new: true }
    );

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      failedLoginAttempts: user.failedLoginAttempts,
      isLocked: user.isLocked,
    };
  }

  async unlockUser(userId: string): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isLocked: false, failedLoginAttempts: 0 },
      { new: true }
    );

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      failedLoginAttempts: user.failedLoginAttempts,
      isLocked: user.isLocked,
    };
  }
    async findAll(): Promise<User[]> {
    const users = await UserModel.find();

    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      failedLoginAttempts: user.failedLoginAttempts,
      isLocked: user.isLocked,
    }));
  }

  async updateRole(userId: string, role: string): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      failedLoginAttempts: user.failedLoginAttempts,
      isLocked: user.isLocked,
    };
  }

  async countAll(): Promise<number> {
    return await UserModel.countDocuments();
  }
}