import { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import LikeModel from "../database/models/LikeModel";

export class MongoLikeRepository implements ILikeRepository {
  async create(data: {
    userId: string;
    targetId: string;
    targetType: "post" | "comment";
  }): Promise<any> {
    return await LikeModel.create(data);
  }

  async findOne(
    userId: string,
    targetId: string,
    targetType: "post" | "comment"
  ): Promise<any | null> {
    return await LikeModel.findOne({ userId, targetId, targetType });
  }

  async delete(
    userId: string,
    targetId: string,
    targetType: "post" | "comment"
  ): Promise<boolean> {
    const deletedLike = await LikeModel.findOneAndDelete({
      userId,
      targetId,
      targetType,
    });

    return !!deletedLike;
  }

  async countByTarget(
    targetId: string,
    targetType: "post" | "comment"
  ): Promise<number> {
    return await LikeModel.countDocuments({ targetId, targetType });
  }
async countPostLikes(): Promise<number> {
  return await LikeModel.countDocuments({ targetType: "post" });
}

async countCommentLikes(): Promise<number> {
  return await LikeModel.countDocuments({ targetType: "comment" });
}
}