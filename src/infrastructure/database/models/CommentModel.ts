import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    userId: { type: String, required: true },
    postId: { type: String, required: true },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model("Comment", CommentSchema);