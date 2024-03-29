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
import parseReq from "./middlewares/parseReq";
const port = parseInt(process.env.PORT as string) || 5000;
import logger from "./middlewares/logger";

const server = new ApolloServer<BaseContext>({
  introspection: true,
  schema,
  logger,
  plugins: [
    {
      async requestDidStart(
        context: GraphQLRequestContext<GlobalContext>
      ): Promise<GraphQLRequestListener<GlobalContext> | void> {
        const { request } = context;
        if (request.operationName !== "IntrospectionQuery")
          logger.info(
            `request : ${request.http?.method}:${request.operationName}`
          );
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
});

startStandaloneServer(server, {
  listen: { port },
  context: async ({ req }: StandaloneServerContextFunctionArgument) => ({
    access_token: req.headers?.access_token,
    verify: req.headers.v === "true",
  }),
})
  .then(({ url }: { url: string }) => {
    logger.info(`🚀  Server ready at: ${url}`);
  })
  .catch((err) => logger.error(err));
