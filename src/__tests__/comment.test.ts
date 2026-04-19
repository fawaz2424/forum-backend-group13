import { CreateComment } from '../application/use-cases/CreateComment';
import { GetComments } from '../application/use-cases/GetComments';
import { UpdateComment } from '../application/use-cases/UpdateComment';
import { DeleteComment } from '../application/use-cases/DeleteComment';

// Mock repository — no real database needed
const mockCommentRepository = {
  createComment: jest.fn(),
  getCommentsByPost: jest.fn(),
  getCommentById: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// =====================
// CreateComment Tests
// =====================
describe('CreateComment', () => {
  it('should create a comment successfully', async () => {
    const commentData = {
      content: 'Test Comment',
      userId: 'user123',
      postId: 'post123',
    };

    mockCommentRepository.createComment.mockResolvedValue(commentData);

    const useCase = new CreateComment(mockCommentRepository);
    const result = await useCase.execute(commentData);

    expect(mockCommentRepository.createComment).toHaveBeenCalledWith(commentData);
    expect(result).toEqual(commentData);
  });
});

// =====================
// GetComments Tests
// =====================
describe('GetComments', () => {
  it('should return all comments for a post', async () => {
    const comments = [
      { content: 'Comment 1', userId: 'user1', postId: 'post123' },
      { content: 'Comment 2', userId: 'user2', postId: 'post123' },
    ];

    mockCommentRepository.getCommentsByPost.mockResolvedValue(comments);

    const useCase = new GetComments(mockCommentRepository);
    const result = await useCase.execute('post123');

    expect(mockCommentRepository.getCommentsByPost).toHaveBeenCalledWith('post123');
    expect(result).toEqual(comments);
  });

  it('should return empty array when no comments exist', async () => {
    mockCommentRepository.getCommentsByPost.mockResolvedValue([]);

    const useCase = new GetComments(mockCommentRepository);
    const result = await useCase.execute('post123');

    expect(result).toEqual([]);
  });
});

// =====================
// UpdateComment Tests
// =====================
describe('UpdateComment', () => {
  it('should update a comment successfully when user is the owner', async () => {
    const existingComment = {
      _id: 'comment123',
      content: 'Old Content',
      userId: 'user123',
      postId: 'post123',
    };
    const updatedComment = {
      _id: 'comment123',
      content: 'New Content',
      userId: 'user123',
      postId: 'post123',
    };

    mockCommentRepository.getCommentById.mockResolvedValue(existingComment);
    mockCommentRepository.updateComment.mockResolvedValue(updatedComment);

    const useCase = new UpdateComment(mockCommentRepository);
    const result = await useCase.execute('comment123', 'user123', 'New Content');

    expect(result).toEqual(updatedComment);
  });

  it('should throw error when comment does not exist', async () => {
    mockCommentRepository.getCommentById.mockResolvedValue(null);

    const useCase = new UpdateComment(mockCommentRepository);

    await expect(
      useCase.execute('comment123', 'user123', 'New Content')
    ).rejects.toThrow('Comment not found');
  });

  it('should throw error when user is not the owner', async () => {
    const existingComment = {
      _id: 'comment123',
      content: 'Old Content',
      userId: 'owner123',
      postId: 'post123',
    };

    mockCommentRepository.getCommentById.mockResolvedValue(existingComment);

    const useCase = new UpdateComment(mockCommentRepository);

    await expect(
      useCase.execute('comment123', 'differentUser', 'New Content')
    ).rejects.toThrow('Unauthorized: you can only edit your own comments');
  });
});

// =====================
// DeleteComment Tests
// =====================
describe('DeleteComment', () => {
  it('should delete a comment successfully when user is the owner', async () => {
    const existingComment = {
      _id: 'comment123',
      content: 'Test Content',
      userId: 'user123',
      postId: 'post123',
    };

    mockCommentRepository.getCommentById.mockResolvedValue(existingComment);
    mockCommentRepository.deleteComment.mockResolvedValue(existingComment);

    const useCase = new DeleteComment(mockCommentRepository);
    const result = await useCase.execute('comment123', 'user123');

    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith('comment123');
    expect(result).toEqual(existingComment);
  });

  it('should throw error when comment does not exist', async () => {
    mockCommentRepository.getCommentById.mockResolvedValue(null);

    const useCase = new DeleteComment(mockCommentRepository);

    await expect(
      useCase.execute('comment123', 'user123')
    ).rejects.toThrow('Comment not found');
  });

  it('should throw error when user is not the owner', async () => {
    const existingComment = {
      _id: 'comment123',
      content: 'Test Content',
      userId: 'owner123',
      postId: 'post123',
    };

    mockCommentRepository.getCommentById.mockResolvedValue(existingComment);

    const useCase = new DeleteComment(mockCommentRepository);

    await expect(
      useCase.execute('comment123', 'differentUser')
    ).rejects.toThrow('Unauthorized: you can only delete your own comments');
  });
});