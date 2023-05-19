import { GraphQLError } from "graphql";

export default function errorHandling(err: any) {
  throw new GraphQLError(err?.response?.data?.message, {
    extensions: {
      code: err?.response?.status,
    },
  }).message;
}
