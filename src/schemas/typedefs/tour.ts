export const tourTypeDefs = `#graphql
  type game {
    _id: String
    name: String
    type: String
    image: String
    description: String
  }

  type achievement {
    _id: ID
    name: String
    image: String
    Game: game
  }

  type Query {
    getUserAchievement: [achievement]
    getGameList: [game]
  }
`;
