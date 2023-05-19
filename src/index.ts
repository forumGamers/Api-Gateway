import { config } from "dotenv";

config();

import { ApolloServer } from "@apollo/server";
import {
  startStandaloneServer,
  StandaloneServerContextFunctionArgument,
} from "@apollo/server/standalone";
import schema from "./schemas";
const port = process.env.PORT || (5000 as number);

const server = new ApolloServer({
  introspection: true,
  schema,
});

startStandaloneServer(server, {
  listen: { port: port as number },
  context: async ({ req, res }: StandaloneServerContextFunctionArgument) => {
    return {
      access_token: req.headers?.access_token,
    };
  },
})
  .then(({ url }: { url: string }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch((err) => console.log(err));
