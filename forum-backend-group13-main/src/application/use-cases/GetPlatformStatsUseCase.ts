import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ILikeRepository } from "../../domain/repositories/ILikeRepository";

export class GetPlatformStatsUseCase {
  constructor(
    private userRepository: IUserRepository,
    private likeRepository: ILikeRepository
  ) {}

  async execute() {
    const totalUsers = await this.userRepository.countAll();
    const totalLikes = await this.likeRepository.countAll();

    return {
      message: "Platform stats fetched successfully",
      data: {
        totalUsers,
        totalPosts: 0,
        totalComments: 0,
        totalLikes,
      },
    };
  }
}