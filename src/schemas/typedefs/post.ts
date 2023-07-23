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
  }

  type media {
    url: String
    id: String
    type: String
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
