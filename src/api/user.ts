import { userUrl } from "../constants";
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
}

export default new UserApi();
