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
}
