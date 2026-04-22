export class Comment {
  constructor(
    public content: string,
    public userId: string,
    public postId: string
  ) {}
}