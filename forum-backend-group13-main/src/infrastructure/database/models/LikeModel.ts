import mongoose, { Document, Schema } from "mongoose";

export interface ILikeDocument extends Document {
  userId: string;
  targetId: string;
  targetType: "post" | "comment";
  createdAt: Date;
}

const LikeSchema = new Schema<ILikeDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

LikeSchema.index(
  { userId: 1, targetId: 1, targetType: 1 },
  { unique: true }
);

const LikeModel = mongoose.model<ILikeDocument>("Like", LikeSchema);

export default LikeModel;