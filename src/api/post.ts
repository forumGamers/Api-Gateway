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
    const { data, status } = await this.baseMutate<message>({
      url: `/like/${id}`,
      headers: {
        access_token,
      },
      method: "POST",
    });
    if (status !== 201)
      throw {
        message: data.message,
      };

    return data;
  }

  public async unlikeAPost({
    access_token,
    id,
  }: {
    access_token: string | undefined;
    id: string;
  }): Promise<message> {
    const { data, status } = await this.baseMutate<message>({
      url: `/like/${id}`,
      method: "DELETE",
      headers: {
        access_token,
      },
    });

    if (status !== 201)
      throw {
        message: data.message,
      };

    return data;
  }

  public async postAComment({
    access_token,
    text,
    postId,
  }: {
    access_token: string | undefined;
    text: string;
    postId: string;
  }) {
    const { data, status } = await this.baseMutate<
      { id: string; message: string } | message
    >({
      url: `/comment/${postId}`,
      method: "POST",
      headers: {
        access_token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        text,
      },
    });

    if (status !== 201)
      throw {
        message: data.message,
      };

    return data;
  }
}

export default new PostApi();
