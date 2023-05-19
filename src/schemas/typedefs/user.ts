export const userTypeDefs = `#graphql
  type message {
    message: String!
  }

  type access_token {
    access_token: String!
  }

  type following {
    id: ID
    UserId: Int
    StoreId: Int
    createdAt: String
    updatedAt: String
  }

  type topUp {
    id: ID
    amount: Int
    UserId: Int
    status: String
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
    Followings: [following]
    TopUps: [topUp]
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

  type Query {
    getUserData: user
  }

  type Mutation {
    register(register: registerInput!): message!
    login(login: loginInput!): access_token!
    verifyUser(token: tokenVerification!): message
  }
`;
