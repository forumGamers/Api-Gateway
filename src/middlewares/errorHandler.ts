import { GraphQLError } from "graphql";

export default function errorHandling(
  err: { message: string; statusCode: number; code?: string } | Error | any
) {
  console.log(err);
  throw new GraphQLError(err?.response?.data?.message || err.message || err, {
    extensions: {
      code: err?.code || err?.response?.status || err.statusCode,
    },
  }).message;
}
