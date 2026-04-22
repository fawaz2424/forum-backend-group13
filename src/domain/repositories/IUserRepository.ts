import { User } from "../entities/User";

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;

  incrementFailedLoginAttempts(userId: string): Promise<User | null>;
  resetFailedLoginAttempts(userId: string): Promise<User | null>;
  lockUser(userId: string): Promise<User | null>;
  unlockUser(userId: string): Promise<User | null>;

  findAll?(): Promise<User[]>;
  updateRole?(userId: string, role: string): Promise<User | null>;
  countAll?(): Promise<number>;
}