export const tourTypeDefs = `#graphql
  type game {
    id: String
    name: String
    type: String
    image: String
    description: String
  }

  type achievement {
    id: ID
    name: String
    image: String
    Game: game
  }

  type Query {
    getUserAchievement: [achievement]
  }
`;
