import { userReadURL } from "../constants";
import { message } from "../interfaces";
import { user } from "../interfaces/post";
import BaseRequest from "./request";

class UserApi extends BaseRequest {
  constructor() {
    super(userReadURL);
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

  public async followAUser(
    id: string,
    access_token: string | undefined
  ): Promise<message> {
    const { data, status } = await this.baseMutate<message>({
      url: `/following-user/${id}`,
      method: "POST",
      headers: {
        access_token,
      },
    });

    if (status !== 201) throw { message: data.message };

    return data;
  }

  public async unFollowAUser(
    id: string,
    access_token: string | undefined
  ): Promise<message> {
    const { data, status } = await this.baseMutate<message>({
      url: `/following-user/${id}`,
      method: "DELETE",
      headers: {
        access_token,
      },
    });

    if (status !== 200) throw { message: data.message };

    return data;
  }
}

export default new UserApi();
