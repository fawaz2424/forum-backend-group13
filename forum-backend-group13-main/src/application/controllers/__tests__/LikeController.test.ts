import { LikeController } from "../LikeController";
import { LikePostUseCase } from "../../use-cases/LikePostUseCase";
import { UnlikePostUseCase } from "../../use-cases/UnlikePostUseCase";
import { LikeCommentUseCase } from "../../use-cases/LikeCommentUseCase";
import { UnlikeCommentUseCase } from "../../use-cases/UnlikeCommentUseCase";

jest.mock("../../use-cases/LikePostUseCase");
jest.mock("../../use-cases/UnlikePostUseCase");
jest.mock("../../use-cases/LikeCommentUseCase");
jest.mock("../../use-cases/UnlikeCommentUseCase");

describe("LikeController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      params: {},
      user: { id: "user-1" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("likePost", () => {
    it("should like a post successfully", async () => {
      req.params.postId = "post-1";

      const mockResult = {
        message: "Post liked successfully",
        data: { postId: "post-1", userId: "user-1" },
      };

      (LikePostUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockResult),
      }));

      await LikeController.likePost(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Post liked successfully",
        data: mockResult.data,
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      req.user = undefined;
      req.params.postId = "post-1";

      await LikeController.likePost(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized",
      });
    });

    it("should return 400 if postId is missing", async () => {
      req.params.postId = undefined;

      await LikeController.likePost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Post ID is required",
      });
    });

    it("should return 400 if liking post fails", async () => {
      req.params.postId = "post-1";

      (LikePostUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("Post already liked")),
      }));

      await LikeController.likePost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Post already liked",
      });
    });
  });

  describe("unlikePost", () => {
    it("should unlike a post successfully", async () => {
      req.params.postId = "post-1";

      const mockResult = {
        message: "Post unliked successfully",
      };

      (UnlikePostUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockResult),
      }));

      await LikeController.unlikePost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Post unliked successfully",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      req.user = undefined;
      req.params.postId = "post-1";

      await LikeController.unlikePost(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if unlike post fails", async () => {
      req.params.postId = "post-1";

      (UnlikePostUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("Like not found")),
      }));

      await LikeController.unlikePost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Like not found",
      });
    });
  });

  describe("likeComment", () => {
    it("should like a comment successfully", async () => {
      req.params.commentId = "comment-1";

      const mockResult = {
        message: "Comment liked successfully",
        data: { commentId: "comment-1", userId: "user-1" },
      };

      (LikeCommentUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockResult),
      }));

      await LikeController.likeComment(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Comment liked successfully",
        data: mockResult.data,
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      req.user = undefined;
      req.params.commentId = "comment-1";

      await LikeController.likeComment(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if commentId is missing", async () => {
      req.params.commentId = undefined;

      await LikeController.likeComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Comment ID is required",
      });
    });

    it("should return 400 if liking comment fails", async () => {
      req.params.commentId = "comment-1";

      (LikeCommentUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("Comment already liked")),
      }));

      await LikeController.likeComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Comment already liked",
      });
    });
  });

  describe("unlikeComment", () => {
    it("should unlike a comment successfully", async () => {
      req.params.commentId = "comment-1";

      const mockResult = {
        message: "Comment unliked successfully",
      };

      (UnlikeCommentUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockResult),
      }));

      await LikeController.unlikeComment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Comment unliked successfully",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      req.user = undefined;
      req.params.commentId = "comment-1";

      await LikeController.unlikeComment(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if unlike comment fails", async () => {
      req.params.commentId = "comment-1";

      (UnlikeCommentUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("Comment like not found")),
      }));

      await LikeController.unlikeComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Comment like not found",
      });
    });
  });
});