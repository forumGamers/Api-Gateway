export const postTypeDefs = `#graphql
  type timeLine {
    _id: ID
    userId: String
    text: String
    media: media
    allowComment: Boolean
    createdAt: String
    updatedAt: String
    countLike: Int
    countComment: Int
    countShare: Int
    User: userTimeLine
    isLiked: Boolean
    isShared: Boolean
    tags: [String]
    privacy: String
  }

  input timeLineParams {
    userIds: String
    page: String
    limit: String
  }

  input Params {
    page: String
    limit: String
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
    bio: String
    isfollowed: Boolean
    backgroundImage: String
  }

  type reply {
    _id: ID
    userId: String
    text: String
    commentId: String
    CreatedAt: String
    UpdatedAt: String
    User: userTimeLine
  }

  type comment {
    _id: ID
    userId: String
    text: String
    postId: String
    CreatedAt: String
    UpdatedAt: String
    Reply: [reply]
    User: userTimeLine
  }

  type Query {
    getTimeLine(query: timeLineParams): [timeLine]
    getPostComment(id: String!, param: Params): [comment]
    getPostById(id: String!): timeLine
    getMyPost(query: timeLineParams): [timeLine]
    getMedia(query: timeLineParams): [timeLine]
    getMyLikedPost(query: timeLineParams): [timeLine]
  }

  type Mutation {
    likeAPost(id: String!): message!
    unLikeAPost(id: String!): message!
    commentAPost(text: String!, postId: String!): resultInsert!
    replyComment(text: String!, commentId: String!): resultInsert!
  }
`;
