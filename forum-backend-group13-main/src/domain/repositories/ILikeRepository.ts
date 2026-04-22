export interface ILikeRepository {
  create(data: {
    userId: string;
    targetId: string;
    targetType: "post" | "comment";
  }): Promise<any>;

  findOne(
    userId: string,
    targetId: string,
    targetType: "post" | "comment"
  ): Promise<any | null>;

  delete(
    userId: string,
    targetId: string,
    targetType: "post" | "comment"
  ): Promise<boolean>;

  countByTarget(
    targetId: string,
    targetType: "post" | "comment"
  ): Promise<number>;

  countAll(): Promise<number>;
}