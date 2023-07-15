export const postTypeDefs = `#graphql
  type timeLine {
    _id: ID
    userId: Int
    text: String
    imageUrl: String
    imageId: String
    allowComment: Boolean
    CreatedAt: String
    UpdatedAt: String
    CountLike: Int
    CountComment: Int
    CountShare: Int
    User: userTimeLine
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
`;
