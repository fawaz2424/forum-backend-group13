import { CreatePost } from "../../use-cases/CreatePost";
import { GetPosts } from "../../use-cases/GetPosts";
import { GetPostById } from "../../use-cases/GetPostById";
import { UpdatePost } from "../../use-cases/UpdatePost";
import { DeletePost } from "../../use-cases/DeletePost";
import { IPostRepository } from "../../../domain/repositories/IPostRepository";

const mockPostRepository: jest.Mocked<IPostRepository> = {
  createPost: jest.fn(),
  getAllPosts: jest.fn(),
  getPostById: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ====================
// CreatePost Tests
// ====================
describe("CreatePost", () => {
  it("should create a post successfully", async () => {
    const postData = { title: "Test Post", content: "Hello World", userId: "user1" };
    mockPostRepository.createPost.mockResolvedValue(postData as any);

    const useCase = new CreatePost(mockPostRepository);
    const result = await useCase.execute(postData);

    expect(mockPostRepository.createPost).toHaveBeenCalledWith(postData);
    expect(result).toEqual(postData);
  });

  it("should throw if repository throws", async () => {
    mockPostRepository.createPost.mockRejectedValue(new Error("DB error"));

    const useCase = new CreatePost(mockPostRepository);
    await expect(
      useCase.execute({ title: "Title", content: "Content", userId: "user1" })
    ).rejects.toThrow("DB error");
  });
});

// ====================
// GetPosts Tests
// ====================
describe("GetPosts", () => {
  it("should return all posts", async () => {
    const posts = [
      { title: "Post 1", content: "Content 1", userId: "user1" },
      { title: "Post 2", content: "Content 2", userId: "user2" },
    ];
    mockPostRepository.getAllPosts.mockResolvedValue(posts as any);

    const useCase = new GetPosts(mockPostRepository);
    const result = await useCase.execute();

    expect(mockPostRepository.getAllPosts).toHaveBeenCalled();
    expect(result).toEqual(posts);
  });

  it("should return an empty array if no posts exist", async () => {
    mockPostRepository.getAllPosts.mockResolvedValue([]);

    const useCase = new GetPosts(mockPostRepository);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});

// ====================
// GetPostById Tests
// ====================
describe("GetPostById", () => {
  it("should return a post by id", async () => {
    const post = { _id: "123", title: "Post 1", content: "Content 1", userId: "user1" };
    mockPostRepository.getPostById.mockResolvedValue(post as any);

    const useCase = new GetPostById(mockPostRepository);
    const result = await useCase.execute("123");

    expect(mockPostRepository.getPostById).toHaveBeenCalledWith("123");
    expect(result).toEqual(post);
  });

  it("should return null if post not found", async () => {
    mockPostRepository.getPostById.mockResolvedValue(null);

    const useCase = new GetPostById(mockPostRepository);
    const result = await useCase.execute("invalid-id");

    expect(result).toBeNull();
  });
});

// ====================
// UpdatePost Tests
// ====================
describe("UpdatePost", () => {
  it("should update a post successfully", async () => {
    const existing = { _id: "123", title: "Old", content: "Old content", userId: "user1" };
    const updated = { _id: "123", title: "Updated", content: "Updated content", userId: "user1" };
    mockPostRepository.getPostById.mockResolvedValue(existing as any);
    mockPostRepository.updatePost.mockResolvedValue(updated as any);

    const useCase = new UpdatePost(mockPostRepository);
    const result = await useCase.execute("123", "user1", {
      title: "Updated",
      content: "Updated content",
    });

    expect(result).toEqual(updated);
  });

  it("should throw 'Post not found' if post does not exist", async () => {
    mockPostRepository.getPostById.mockResolvedValue(null);

    const useCase = new UpdatePost(mockPostRepository);
    await expect(
      useCase.execute("bad-id", "user1", { title: "X", content: "X" })
    ).rejects.toThrow("Post not found");
  });

  it("should throw 'Unauthorized' if user is not the owner", async () => {
    const existing = { _id: "123", userId: "owner123" };
    mockPostRepository.getPostById.mockResolvedValue(existing as any);

    const useCase = new UpdatePost(mockPostRepository);
    await expect(
      useCase.execute("123", "wrong-user", { title: "X", content: "X" })
    ).rejects.toThrow("Unauthorized");
  });
});

// ====================
// DeletePost Tests
// ====================
describe("DeletePost", () => {
  it("should delete a post successfully", async () => {
    const existing = { _id: "123", userId: "user1" };
    mockPostRepository.getPostById.mockResolvedValue(existing as any);
    mockPostRepository.deletePost.mockResolvedValue(undefined as any);

    const useCase = new DeletePost(mockPostRepository);
    await useCase.execute("123", "user1");

    expect(mockPostRepository.deletePost).toHaveBeenCalledWith("123");
  });

  it("should throw 'Post not found' if post does not exist", async () => {
    mockPostRepository.getPostById.mockResolvedValue(null);

    const useCase = new DeletePost(mockPostRepository);
    await expect(useCase.execute("invalid-id", "user1")).rejects.toThrow("Post not found");
  });

  it("should throw 'Unauthorized' if user is not the owner", async () => {
    const existing = { _id: "123", userId: "owner123" };
    mockPostRepository.getPostById.mockResolvedValue(existing as any);

    const useCase = new DeletePost(mockPostRepository);
    await expect(useCase.execute("123", "wrong-user")).rejects.toThrow("Unauthorized");
  });
});
