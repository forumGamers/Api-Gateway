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

export interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  bio: string;
  image_url: string;
  image_id: string;
  background_url: string;
  background_id: string;
  status: "active" | "nonActive";
  created_at: Date;
  updated_at: Date;
  store_id?: string;
  division?:
    | "Director"
    | "Finance"
    | "IT"
    | "Third Party"
    | "Customer Service"
    | "Marketing"
    | null;
  role?: "Supervisor" | "Manager" | "Staff" | null;
  following: string[];
  followers: string[];
  access_token: string;
  token_as: "User" | "Admin" | "Seller";
}

export interface UserAccount {
  id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  bio: string;
  image_url: string;
  image_id: string;
  background_url: string;
  background_id: string;
  status: "active" | "nonActive";
  created_at: Date;
  updated_at: Date;
  following: string[];
  followers: string[];
  access_token: string;
  token_as: "User" | "Admin" | "Seller";
}

export interface AdminAccount extends UserAccount {
  store_id: string;
}

export interface SellerAccount extends UserAccount {
  division:
    | "Director"
    | "Finance"
    | "IT"
    | "Third Party"
    | "Customer Service"
    | "Marketing";
  role: "Supervisor" | "Manager" | "Staff";
}
