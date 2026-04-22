import { Request, Response } from "express";
import { PostController } from "../../controllers/PostController";

jest.mock("../../use-cases/CreatePost");
jest.mock("../../use-cases/GetPosts");
jest.mock("../../use-cases/GetPostById");
jest.mock("../../use-cases/UpdatePost");
jest.mock("../../use-cases/DeletePost");
jest.mock("../../../infrastructure/repositories/PostRepository");

import { CreatePost } from "../../use-cases/CreatePost";
import { GetPosts } from "../../use-cases/GetPosts";
import { GetPostById } from "../../use-cases/GetPostById";
import { UpdatePost } from "../../use-cases/UpdatePost";
import { DeletePost } from "../../use-cases/DeletePost";

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
// createPost
// ====================
describe("PostController.createPost", () => {
  it("should create a post and return 201", async () => {
    const post = { title: "Title", content: "Content", userId: "user1" };
    (CreatePost as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(post),
    }));

    const req = mockReq({ body: { title: "Title", content: "Content" } });
    const res = mockRes();

    await PostController.createPost(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(post);
  });

  it("should return 500 on unexpected error", async () => {
    (CreatePost as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    const req = mockReq({ body: { title: "Title", content: "Content" } });
    const res = mockRes();

    await PostController.createPost(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ====================
// getPosts
// ====================
describe("PostController.getPosts", () => {
  it("should return all posts with 200", async () => {
    const posts = [{ title: "Post 1" }, { title: "Post 2" }];
    (GetPosts as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(posts),
    }));

    const req = mockReq();
    const res = mockRes();

    await PostController.getPosts(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(posts);
  });

  it("should return 500 on failure", async () => {
    (GetPosts as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    const req = mockReq();
    const res = mockRes();

    await PostController.getPosts(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ====================
// getPostById
// ====================
describe("PostController.getPostById", () => {
  it("should return a post by id", async () => {
    const post = { _id: "123", title: "Post 1" };
    (GetPostById as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(post),
    }));

    const req = mockReq({ params: { id: "123" } });
    const res = mockRes();

    await PostController.getPostById(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(post);
  });

  it("should return 404 if post not found", async () => {
    (GetPostById as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(null),
    }));

    const req = mockReq({ params: { id: "bad-id" } });
    const res = mockRes();

    await PostController.getPostById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 500 on unexpected error", async () => {
    (GetPostById as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    const req = mockReq({ params: { id: "123" } });
    const res = mockRes();

    await PostController.getPostById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ====================
// updatePost
// ====================
describe("PostController.updatePost", () => {
  it("should update a post successfully", async () => {
    const updated = { _id: "123", title: "Updated", content: "Updated content" };
    (UpdatePost as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(updated),
    }));

    const req = mockReq({
      params: { id: "123" },
      body: { title: "Updated", content: "Updated content" },
    });
    const res = mockRes();

    await PostController.updatePost(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("should return 403 if user is not the owner", async () => {
    (UpdatePost as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("Unauthorized")),
    }));

    const req = mockReq({ params: { id: "123" }, body: { title: "X", content: "X" } });
    const res = mockRes();

    await PostController.updatePost(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 404 if post not found", async () => {
    (UpdatePost as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("Post not found")),
    }));

    const req = mockReq({ params: { id: "bad-id" }, body: { title: "X", content: "X" } });
    const res = mockRes();

    await PostController.updatePost(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ====================
// deletePost
// ====================
describe("PostController.deletePost", () => {
  it("should delete a post and return success message", async () => {
    (DeletePost as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(undefined),
    }));

    const req = mockReq({ params: { id: "123" } });
    const res = mockRes();

    await PostController.deletePost(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({ message: "Post deleted successfully" });
  });

  it("should return 403 if user is not the owner", async () => {
    (DeletePost as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("Unauthorized")),
    }));

    const req = mockReq({ params: { id: "123" } });
    const res = mockRes();

    await PostController.deletePost(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 404 if post not found", async () => {
    (DeletePost as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error("Post not found")),
    }));

    const req = mockReq({ params: { id: "bad-id" } });
    const res = mockRes();

    await PostController.deletePost(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
