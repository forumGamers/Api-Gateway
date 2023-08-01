import { userUrl } from "../constants";
import { message } from "../interfaces";
import BaseRequest from "./request";

class UserApi extends BaseRequest {
  constructor() {
    super(userUrl);
  }

  public async getMultipleUserById<T>(params: { id: string }): Promise<T> {
    const { data } = await this.baseQuery<T>({
      url: "/users/multiple",
      params,
    });

    return data;
  }

  public async loginHandler({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ access_token: string }> {
    const { data, status } = await this.baseMutate<
      { access_token: string } | message
    >({
      url: "/auth/login",
      data: {
        email,
        password,
      },
      method: "POST",
    });

    if (status !== 200) {
      const { message } = data as message;

      throw { message };
    }

    return data as { access_token: string };
  }

  public async googleLogin(
    access_token: string
  ): Promise<{ access_token: string }> {
    const { data, status } = await this.baseMutate({
      method: "POST",
      url: "/auth/google-login",
      headers: {
        google_token: access_token,
      },
    });

    if (status !== 200) {
      const { message } = data as message;

      throw { message };
    }

    return data as { access_token: string };
  }
}

export default new UserApi();
