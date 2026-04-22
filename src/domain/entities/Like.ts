export interface Like {
  id?: string;
  userId: string;
  targetId: string;
  targetType: "post" | "comment";
  createdAt?: Date;
}