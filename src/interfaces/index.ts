import { BaseContext } from "@apollo/server";

export interface GlobalContext extends BaseContext {
  access_token: string | undefined;
}

export interface message {
  message: string;
}
