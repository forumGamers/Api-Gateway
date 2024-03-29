export interface timeLine {
  _id: string;
  userId: string;
  text: string;
  imageUrl: string;
  imageId: string;
  allowComment: boolean;
  createdAt: string;
  updatedAt: string;
  countLike: number;
  countComment: number;
  countShare: number;
}

export interface user {
  id: string;
  UUID: string;
  imageUrl: string;
  username: string;
  bio: string | null;
  isfollowed?: boolean;
}

export interface comment {
  _id: string;
  userId: string;
  text: string;
  postId: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  reply: reply[];
}

export interface reply {
  _id: string;
  userId: string;
  text: string;
  CommentId: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface PostDataParams {
  userIds?: string;
  page?: string;
  limit?: string;
}
