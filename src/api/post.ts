import { postUrl } from "../constants";
import { message } from "../interfaces";
import BaseRequest from "./request";

class PostApi extends BaseRequest {
  constructor() {
    super(postUrl);
  }

  public async getPublicContent<T>(): Promise<T> {
    const { data } = await this.baseQuery<T>({
      url: "/post/public-content",
    });

    return data;
  }

  public async getPostComment<T>(id: string): Promise<T> {
    const { data } = await this.baseQuery<T>({
      url: `/comment/${id}`,
    });

    return data;
  }

  public async likeAPost({
    access_token,
    id,
  }: {
    access_token: string | undefined;
    id: string;
  }): Promise<{ message: string }> {
    const { data } = await this.baseMutate<message>({
      url: `/like/${id}`,
      headers: {
        access_token,
      },
      method: "POST",
    });

    return data;
  }

  public async unlikeAPost({
    access_token,
    id,
  }: {
    access_token: string | undefined;
    id: string;
  }): Promise<message> {
    const { data } = await this.baseMutate<message>({
      url: `/like/${id}`,
      method: "DELETE",
      headers: {
        access_token,
      },
    });

    return data;
  }
}

export default new PostApi();
