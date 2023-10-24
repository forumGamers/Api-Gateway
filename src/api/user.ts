import { userReadURL } from "../constants";
import { message } from "../interfaces";
import { user } from "../interfaces/post";
import BaseRequest from "./request";

class UserApi extends BaseRequest {
  constructor() {
    super(userReadURL);
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
