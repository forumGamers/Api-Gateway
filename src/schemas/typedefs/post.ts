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
  }

  type Query {
    getTimeLine: [timeLine]
  }
`;
