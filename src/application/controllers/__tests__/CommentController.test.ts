import { Request, Response } from "express";
import { CommentController } from "../../controllers/CommentController";

jest.mock("../../use-cases/CreateComment");
jest.mock("../../use-cases/GetComments");
jest.mock("../../use-cases/UpdateComment");
jest.mock("../../use-cases/DeleteComment");
jest.mock("../../../infrastructure/repositories/CommentRepository");

import { CreateComment } from "../../use-cases/CreateComment";
import { GetComments } from "../../use-cases/GetComments";
import { UpdateComment } from "../../use-cases/UpdateComment";
import { DeleteComment } from "../../use-cases/DeleteComment";

const mockReq = (overrides = {}): Partial<Request> =>
  ({ body: {}, params: {}, user: { id: "user1" }, ...overrides } as any);

const mockRes = (): Partial<Response> => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

// ====================
// createComment
// ====================
describe("CommentController.createComment", () => {
  it("should create a comment and return 201", async () => {
    const comment = { postId: "post1", userId: "user1", content: "Nice!" };
    (CreateComment as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(comment),
    }));

    const req = mockReq({ params: { postId: "post1" }, body: { content: "Nice!" } });
    const res = mockRes();

    await CommentController.createComment(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(comment);
  });

  it("should return 500 on unexpected error", async () => {
    (CreateComment as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    const req = mockReq({ params: { postId: "post1" }, body: { content: "Nice!" } });
    const res = mockRes();

    await CommentController.createComment(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ====================
// getComments
// ====================
describe("CommentController.getComments", () => {
  it("should return all comments for a post", async () => {
    const comments = [{ content: "Comment 1" }, { content: "Comment 2" }];
    (GetComments as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(comments),
    }));

    const req = mockReq({ params: { postId: "post1" } });
    const res = mockRes();

    await CommentController.getComments(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(comments);
  });

  it("should return empty array if no comments", async () => {
    (GetComments as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue([]),
    }));

    const req = mockReq({ params: { postId: "post1" } });
    const res = mockRes();

    await CommentController.getComments(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("should return 500 on failure", async () => {
    (GetComments as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    const req = mockReq({ params: { postId: "post1" } });
    const res = mockRes();

    await CommentController.getComments(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ====================
// updateComment
// ====================
describe("CommentController.updateComment", () => {
  it("should update a comment successfully", async () => {
    const updated = { _id: "c1", content: "Updated!" };
    (UpdateComment as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(updated),
    }));

    const req = mockReq({ params: { id: "c1" }, body: { content: "Updated!" } });
    const res = mockRes();

    await CommentController.updateComment(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("should return 403 if user is not the owner", async () => {
    (UpdateComment as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("Unauthorized")),
    }));

    const req = mockReq({ params: { id: "c1" }, body: { content: "Updated!" } });
    const res = mockRes();

    await CommentController.updateComment(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 404 if comment not found", async () => {
    (UpdateComment as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("Comment not found")),
    }));

    const req = mockReq({ params: { id: "bad-id" }, body: { content: "Updated!" } });
    const res = mockRes();

    await CommentController.updateComment(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ====================
// deleteComment
// ====================
describe("CommentController.deleteComment", () => {
  it("should delete a comment and return success message", async () => {
    (DeleteComment as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(undefined),
    }));

    const req = mockReq({ params: { id: "c1" } });
    const res = mockRes();

    await CommentController.deleteComment(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({ message: "Comment deleted successfully" });
  });

  it("should return 403 if user is not the owner", async () => {
    (DeleteComment as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("Unauthorized")),
    }));

    const req = mockReq({ params: { id: "c1" } });
    const res = mockRes();

    await CommentController.deleteComment(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 404 if comment not found", async () => {
    (DeleteComment as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("Comment not found")),
    }));

    const req = mockReq({ params: { id: "bad-id" } });
    const res = mockRes();

    await CommentController.deleteComment(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
