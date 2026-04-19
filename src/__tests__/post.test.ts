import { CreatePost } from '../application/use-cases/CreatePost';
import { GetPosts } from '../application/use-cases/GetPosts';
import { GetPostById } from '../application/use-cases/GetPostById';
import { UpdatePost } from '../application/use-cases/UpdatePost';
import { DeletePost } from '../application/use-cases/DeletePost';

// Mock repository — no real database needed
const mockPostRepository = {
  createPost: jest.fn(),
  getAllPosts: jest.fn(),
  getPostById: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// =====================
// CreatePost Tests
// =====================
describe('CreatePost', () => {
  it('should create a post successfully', async () => {
    const postData = {
      title: 'Test Post',
      content: 'Test Content',
      userId: 'user123',
    };

    mockPostRepository.createPost.mockResolvedValue(postData);

    const useCase = new CreatePost(mockPostRepository);
    const result = await useCase.execute(postData);

    expect(mockPostRepository.createPost).toHaveBeenCalledWith(postData);
    expect(result).toEqual(postData);
  });
});

// =====================
// GetPosts Tests
// =====================
describe('GetPosts', () => {
  it('should return all posts', async () => {
    const posts = [
      { title: 'Post 1', content: 'Content 1', userId: 'user1' },
      { title: 'Post 2', content: 'Content 2', userId: 'user2' },
    ];

    mockPostRepository.getAllPosts.mockResolvedValue(posts);

    const useCase = new GetPosts(mockPostRepository);
    const result = await useCase.execute();

    expect(mockPostRepository.getAllPosts).toHaveBeenCalled();
    expect(result).toEqual(posts);
  });

  it('should return empty array when no posts exist', async () => {
    mockPostRepository.getAllPosts.mockResolvedValue([]);

    const useCase = new GetPosts(mockPostRepository);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});

// =====================
// GetPostById Tests
// =====================
describe('GetPostById', () => {
  it('should return a post by id', async () => {
    const post = { _id: 'post123', title: 'Test', content: 'Content', userId: 'user1' };

    mockPostRepository.getPostById.mockResolvedValue(post);

    const useCase = new GetPostById(mockPostRepository);
    const result = await useCase.execute('post123');

    expect(mockPostRepository.getPostById).toHaveBeenCalledWith('post123');
    expect(result).toEqual(post);
  });

  it('should return null when post does not exist', async () => {
    mockPostRepository.getPostById.mockResolvedValue(null);

    const useCase = new GetPostById(mockPostRepository);
    const result = await useCase.execute('nonexistent');

    expect(result).toBeNull();
  });
});

// =====================
// UpdatePost Tests
// =====================
describe('UpdatePost', () => {
  it('should update a post successfully when user is the owner', async () => {
    const existingPost = { _id: 'post123', title: 'Old Title', userId: 'user123' };
    const updatedPost = { _id: 'post123', title: 'New Title', userId: 'user123' };

    mockPostRepository.getPostById.mockResolvedValue(existingPost);
    mockPostRepository.updatePost.mockResolvedValue(updatedPost);

    const useCase = new UpdatePost(mockPostRepository);
    const result = await useCase.execute('post123', 'user123', { title: 'New Title' });

    expect(result).toEqual(updatedPost);
  });

  it('should throw error when post does not exist', async () => {
    mockPostRepository.getPostById.mockResolvedValue(null);

    const useCase = new UpdatePost(mockPostRepository);

    await expect(
      useCase.execute('post123', 'user123', { title: 'New Title' })
    ).rejects.toThrow('Post not found');
  });

  it('should throw error when user is not the owner', async () => {
    const existingPost = { _id: 'post123', title: 'Old Title', userId: 'owner123' };

    mockPostRepository.getPostById.mockResolvedValue(existingPost);

    const useCase = new UpdatePost(mockPostRepository);

    await expect(
      useCase.execute('post123', 'differentUser', { title: 'New Title' })
    ).rejects.toThrow('Unauthorized: you can only edit your own posts');
  });
});

// =====================
// DeletePost Tests
// =====================
describe('DeletePost', () => {
  it('should delete a post successfully when user is the owner', async () => {
    const existingPost = { _id: 'post123', userId: 'user123' };

    mockPostRepository.getPostById.mockResolvedValue(existingPost);
    mockPostRepository.deletePost.mockResolvedValue(existingPost);

    const useCase = new DeletePost(mockPostRepository);
    const result = await useCase.execute('post123', 'user123');

    expect(mockPostRepository.deletePost).toHaveBeenCalledWith('post123');
    expect(result).toEqual(existingPost);
  });

  it('should throw error when post does not exist', async () => {
    mockPostRepository.getPostById.mockResolvedValue(null);

    const useCase = new DeletePost(mockPostRepository);

    await expect(
      useCase.execute('post123', 'user123')
    ).rejects.toThrow('Post not found');
  });

  it('should throw error when user is not the owner', async () => {
    const existingPost = { _id: 'post123', userId: 'owner123' };

    mockPostRepository.getPostById.mockResolvedValue(existingPost);

    const useCase = new DeletePost(mockPostRepository);

    await expect(
      useCase.execute('post123', 'differentUser')
    ).rejects.toThrow('Unauthorized: you can only delete your own posts');
  });
});