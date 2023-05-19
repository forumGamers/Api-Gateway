import { makeExecutableSchema } from "@graphql-tools/schema";
import { userTypeDefs } from "./typedefs/user";
import { userResolver } from "./resolvers/user";
import { tourTypeDefs } from "./typedefs/tour";
import { tourResolver } from "./resolvers/tour";

const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs, tourTypeDefs],
  resolvers: [userResolver, tourResolver],
});

export default schema;
