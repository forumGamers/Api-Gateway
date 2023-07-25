export const postTypeDefs = `#graphql
  type timeLine {
    _id: ID
    userId: Int
    text: String
    Media: media
    allowComment: Boolean
    CreatedAt: String
    UpdatedAt: String
    CountLike: Int
    CountComment: Int
    CountShare: Int
    User: userTimeLine
    isLiked: Boolean
    isShared: Boolean
    tags: [String]
    privacy: String
  }

  type media {
    url: String
    id: String
    type: String
  }

  type message {
    message: String!
  }

  type userTimeLine {
    id: ID
    imageUrl: String
    UUID: ID
    username: String
  }

  type Query {
    getTimeLine: [timeLine]
  }

  type Mutation {
    likeAPost(id: String!): message!
    unLikeAPost(id: String!): message!
  }
`;
