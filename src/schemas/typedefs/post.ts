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

  type resultInsert {
    message: String!
    id: String!
  }

  type userTimeLine {
    id: ID
    imageUrl: String
    UUID: ID
    username: String
  }

  type reply {
    _id: ID
    userId: Int
    text: String
    commentId: String
    CreatedAt: String
    UpdatedAt: String
    User: userTimeLine
  }

  type comment {
    _id: ID
    userId: Int
    text: String
    postId: String
    CreatedAt: String
    UpdatedAt: String
    Reply: [reply]
    User: userTimeLine
  }

  type Query {
    getTimeLine: [timeLine]
    getPostComment(id: String!): [comment]
  }

  type Mutation {
    likeAPost(id: String!): message!
    unLikeAPost(id: String!): message!
    commentAPost(text: String!, postId: String!): resultInsert!
    replyComment(text: String!, commentId: String!): resultInsert!
  }
`;
