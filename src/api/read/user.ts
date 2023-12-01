import { userReadURL } from "../../constants";
import BaseRequest, { BaseResponse } from "../request";
import { message } from "../../interfaces";
import { user } from "../../interfaces/post";
import { User } from "../../interfaces/user";

class UserRead extends BaseRequest {
  constructor() {
    super(userReadURL);
  }

  public async getMultipleUserById(
    params: { ids: string },
    access_token?: string
  ): Promise<User[]> {
    const { data, status } = await this.baseQuery<{ data: User[] | message }>({
      url: "/user/multiple",
      params,
      headers: {
        access_token,
      },
    });

    if (status !== 200) {
      const { message } = data.data as message;

      throw { message };
    }

    return data.data as User[];
  }

  public async getUserData(access_token: string) {
    const { data, status } = await this.baseQuery<{ data: User } | message>({
      url: `/user/me`,
      headers: {
        access_token,
      },
    });

    return (data as { data: User }).data;
  }

  public async getFollowingRecomendation(access_token: string | undefined) {
    const { data, status } = await this.baseQuery<BaseResponse<User>>({
      url: "/user/following-recomendation",
      headers: {
        access_token,
      },
    });

    if (status !== 200) {
      const { message } = data;

      throw { message };
    }

    return data.data as User;
  }
}

export default new UserRead();
