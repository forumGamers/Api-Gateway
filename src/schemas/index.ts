import { makeExecutableSchema } from "@graphql-tools/schema";
import { userTypeDefs } from "./typedefs/user";
import { userResolver } from "./resolvers/user";
import { tourTypeDefs } from "./typedefs/tour";
import { tourResolver } from "./resolvers/tour";
import { storeTypedefs } from "./typedefs/store";
import { storeResolver } from "./resolvers/store";

const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs, tourTypeDefs, storeTypedefs],
  resolvers: [userResolver, tourResolver, storeResolver],
});

export default schema;
