import { makeExecutableSchema } from "@graphql-tools/schema";
import { userTypeDefs } from "./typedefs/user";
import { userResolver } from "./resolvers/user";
import { tourTypeDefs } from "./typedefs/tour";
import { tourResolver } from "./resolvers/tour";
import { storeTypedefs } from "./typedefs/store";
import { storeResolver } from "./resolvers/store";
import { postTypeDefs } from "./typedefs/post";
import { postResolver } from "./resolvers/post";

const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs, tourTypeDefs, storeTypedefs, postTypeDefs],
  resolvers: [userResolver, tourResolver, storeResolver, postResolver],
});

export default schema;
