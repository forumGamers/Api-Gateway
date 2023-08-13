export interface timeLine {
  _id: string;
  userId: number;
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
  id: number;
  UUID: string;
  imageUrl: string;
  username: string;
  bio: string | null;
  isfollowed?: boolean;
}

export interface comment {
  _id: string;
  userId: number;
  text: string;
  postId: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  Reply: reply[];
}

export interface reply {
  _id: string;
  userId: number;
  text: string;
  CommentId: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}
