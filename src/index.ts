import { config } from "dotenv";

config();

import {
  ApolloServer,
  BaseContext,
  GraphQLRequestListener,
  GraphQLRequestContext,
} from "@apollo/server";
import {
  startStandaloneServer,
  StandaloneServerContextFunctionArgument,
} from "@apollo/server/standalone";
import schema from "./schemas";
import { GlobalContext } from "./interfaces";
import parseReq from "./middlewares/didResolveOperation";
const port = parseInt(process.env.PORT as string) || 5000;

const server = new ApolloServer<BaseContext>({
  introspection: true,
  schema,
  plugins: [
    {
      async requestDidStart(
        context: GraphQLRequestContext<GlobalContext>
      ): Promise<GraphQLRequestListener<GlobalContext> | void> {
        return {
          async didResolveOperation(
            requestContext: GraphQLRequestContext<GlobalContext>
          ) {
            await parseReq(requestContext);
          },
        };
      },
    },
  ],
  status400ForVariableCoercionErrors: true,
});

startStandaloneServer(server, {
  listen: { port },
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
