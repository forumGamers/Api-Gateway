export type registerInput = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export type loginInput = {
  email: string;
  password: string;
};

export type tokenVerification = {
  token: string;
};

export type followingStore = {
  id: number;
  UserId: number;
  StoreId: number;
  createdAt: string;
  updatedAt: string;
};

export type followingUser = {
  id: number;
  UserId: number;
  FollowedUser: number;
  createdAt: string;
  updatedAt: string;
};

export type storeUser = {
  ID: number;
  name: string;
  image: string;
  background: string;
  description: string;
};

export type userData = {
  id: number;
  fullName: string;
  username: string;
  email: string;
  isVerified: boolean;
  balance: number;
  imageUrl: string;
  backgroundImage: string;
  phoneNumber: string;
  StoreId: number;
  role: string;
  point: number;
  exp: number;
  createdAt: string;
  updatedAt: string;
  Followings: [followingStore];
  UserFollowings: [followingUser];
  Store?: storeUser;
};
