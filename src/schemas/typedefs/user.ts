export const userTypeDefs = `#graphql
  type message {
    message: String!
  }

  type access_token {
    access_token: String!
  }

  type followingStore {
    id: ID
    UserId: Int
    StoreId: Int
    createdAt: String
    updatedAt: String
  }

  type followingUser {
    id: ID
    UserId: Int
    FollowedUser: Int
    createdAt: String
    updatedAt: String
  }

  type store {
    ID: ID
    name: String
    image: String
    background: String
    description: String
  }

  type user {
    id: ID
    fullName: String
    username: String
    email: String
    isVerified: Boolean
    balance: Int
    imageUrl: String
    backgroundImage: String
    phoneNumber: String
    StoreId: Int
    role: String
    point: Int
    exp: Int
    createdAt: String
    updatedAt: String
    Followings: [followingStore]
    UserFollowings: [followingUser]
    Store: store
  }

  input registerInput {
    fullName: String!
    username: String!
    email: String!
    password: String!
    phoneNumber: String!
  }

  input tokenVerification {
    token: String!
  }

  input loginInput {
    email: String!
    password: String!
  }

  input forgetPass {
    password: String!
    confirmPassword: String!
  }

  type Query {
    getUserData: user
  }

  type Mutation {
    register(register: registerInput!): message!
    login(login: loginInput!): access_token!
    verifyUser(token: tokenVerification!): message
    resetPassword(email: String!): message
    changeForgetPassword(payload: forgetPass!): message
    googleLogin: access_token!
    followAUser(id: String!): message
    unFollowAUser(id: String!): message
  }
`;
