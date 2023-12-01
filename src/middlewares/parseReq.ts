import { GraphQLRequestContext } from "@apollo/server";
import { GlobalContext } from "../interfaces";
import errorHandling from "./errorHandler";
import { decrypt, validateChar } from "../utils/crypto";

function getVariableName(
  context: GraphQLRequestContext<GlobalContext>
): string | null {
  const definitions = context.document?.definitions[0] as any;

  if (definitions?.kind === "OperationDefinition") {
    const variableDefinition = definitions.variableDefinitions?.[0];
    return variableDefinition?.variable?.name?.value;
  }
  return null;
}

export default async function parseReq(
  context: GraphQLRequestContext<GlobalContext>
): Promise<void> {
  try {
    if (context.contextValue.verify) {
      if (!context.request.variables) return;

      const { variables } = context.request;

      const varName = getVariableName(context);

      if (!varName || !variables || !variables[varName]) return;

      if (typeof variables[varName] === "string") {
        context.request.variables[varName] = decrypt(variables[varName]);
        return;
      }

      const decrypted: any = {};

      for (const key in variables[varName]) {
        const value = variables[varName][key];

        const decryptedData = decrypt(value);

        if (
          !key.toLowerCase().includes("password") &&
          validateChar(decryptedData)
        )
          throw {
            statusCode: 400,
            message: `${key} is not allowed contains symbol ${decryptedData}`,
          };

        decrypted[key] = decryptedData;
      }

      context.request.variables[varName] = decrypted;
    }
  } catch (err) {
    errorHandling(err);
  }
}
