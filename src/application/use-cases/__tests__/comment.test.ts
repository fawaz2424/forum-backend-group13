import { CreateComment } from "../../use-cases/CreateComment";
import { GetComments } from "../../use-cases/GetComments";
import { UpdateComment } from "../../use-cases/UpdateComment";
import { DeleteComment } from "../../use-cases/DeleteComment";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";

const mockCommentRepository: jest.Mocked<ICommentRepository> = {
  createComment: jest.fn(),
  getCommentsByPost: jest.fn(),
  getCommentById: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ====================
// CreateComment Tests
// ====================
describe("CreateComment", () => {
  it("should create a comment successfully", async () => {
    const commentData = { postId: "post1", userId: "user1", content: "Nice post!" };
    mockCommentRepository.createComment.mockResolvedValue(commentData as any);

    const useCase = new CreateComment(mockCommentRepository);
    const result = await useCase.execute(commentData);

    expect(mockCommentRepository.createComment).toHaveBeenCalledWith(commentData);
    expect(result).toEqual(commentData);
  });

  it("should throw if repository throws", async () => {
    mockCommentRepository.createComment.mockRejectedValue(new Error("DB error"));

    const useCase = new CreateComment(mockCommentRepository);
    await expect(
      useCase.execute({ postId: "post1", userId: "user1", content: "Hello" })
    ).rejects.toThrow("DB error");
  });
});

// ====================
// GetComments Tests
// ====================
describe("GetComments", () => {
  it("should return all comments for a post", async () => {
    const comments = [
      { postId: "post1", userId: "user1", content: "Comment 1" },
      { postId: "post1", userId: "user2", content: "Comment 2" },
    ];
    mockCommentRepository.getCommentsByPost.mockResolvedValue(comments as any);

    const useCase = new GetComments(mockCommentRepository);
    const result = await useCase.execute("post1");

    expect(mockCommentRepository.getCommentsByPost).toHaveBeenCalledWith("post1");
    expect(result).toEqual(comments);
  });

  it("should return an empty array if no comments exist", async () => {
    mockCommentRepository.getCommentsByPost.mockResolvedValue([]);

    const useCase = new GetComments(mockCommentRepository);
    const result = await useCase.execute("post1");

    expect(result).toEqual([]);
  });
});

// ====================
// UpdateComment Tests
// ====================
describe("UpdateComment", () => {
  it("should update a comment successfully", async () => {
    const existing = { _id: "c1", userId: "user1", content: "Old" };
    const updated = { _id: "c1", userId: "user1", content: "Updated!" };
    mockCommentRepository.getCommentById.mockResolvedValue(existing as any);
    mockCommentRepository.updateComment.mockResolvedValue(updated as any);

    const useCase = new UpdateComment(mockCommentRepository);
    const result = await useCase.execute("c1", "user1", "Updated!");

    expect(mockCommentRepository.updateComment).toHaveBeenCalledWith("c1", "Updated!");
    expect(result).toEqual(updated);
  });

  it("should throw 'Comment not found' if comment does not exist", async () => {
    mockCommentRepository.getCommentById.mockResolvedValue(null);

    const useCase = new UpdateComment(mockCommentRepository);
    await expect(useCase.execute("bad-id", "user1", "Hello")).rejects.toThrow("Comment not found");
  });

  it("should throw 'Unauthorized' if user is not the owner", async () => {
    const existing = { _id: "c1", userId: "owner123" };
    mockCommentRepository.getCommentById.mockResolvedValue(existing as any);

    const useCase = new UpdateComment(mockCommentRepository);
    await expect(useCase.execute("c1", "wrong-user", "Hello")).rejects.toThrow("Unauthorized");
  });
});

// ====================
// DeleteComment Tests
// ====================
describe("DeleteComment", () => {
  it("should delete a comment successfully", async () => {
    const existing = { _id: "c1", userId: "user1" };
    mockCommentRepository.getCommentById.mockResolvedValue(existing as any);
    mockCommentRepository.deleteComment.mockResolvedValue(undefined as any);

    const useCase = new DeleteComment(mockCommentRepository);
    await useCase.execute("c1", "user1");

    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith("c1");
  });

  it("should throw 'Comment not found' if comment does not exist", async () => {
    mockCommentRepository.getCommentById.mockResolvedValue(null);

    const useCase = new DeleteComment(mockCommentRepository);
    await expect(useCase.execute("bad-id", "user1")).rejects.toThrow("Comment not found");
  });

  it("should throw 'Unauthorized' if user is not the owner", async () => {
    const existing = { _id: "c1", userId: "owner123" };
    mockCommentRepository.getCommentById.mockResolvedValue(existing as any);

    const useCase = new DeleteComment(mockCommentRepository);
    await expect(useCase.execute("c1", "wrong-user")).rejects.toThrow("Unauthorized");
  });
});
