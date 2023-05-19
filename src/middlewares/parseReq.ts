import { GraphQLRequestContext } from "@apollo/server";
import { GlobalContext } from "../interfaces";
import errorHandling from "./errorHandler";
import { decrypt, validateChar } from "../utils/crypto";

export default async function parseReq(
  context: GraphQLRequestContext<GlobalContext>
): Promise<void> {
  try {
    const { variables } = context.request;

    const decrypted: any = {};

    for (const key in variables) {
      const value = variables[key];

      const decryptedData = decrypt(value);

      if (
        !key.toLowerCase().includes("password") &&
        validateChar(decryptedData)
      )
        throw {
          statusCode: 400,
          message: `${key} is not allowed contains symbol`,
        };

      decrypted[key] = decryptedData;
    }

    context.request.variables = decrypted;
  } catch (err) {
    errorHandling(err);
  }
}
