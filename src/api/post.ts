import { postReadUrl } from "../constants";
import { message } from "../interfaces";
import { timeLine } from "../interfaces/post";
import BaseRequest from "./request";

class PostApi extends BaseRequest {
  constructor() {
    super(postReadUrl);
  }

  public async getPublicContent<T>(): Promise<T> {
    const { data } = await this.baseQuery<T>({
      url: "/post/public-content",
    });

    return data;
  }

  public async getPostComment<T>(id: string): Promise<T> {
    const { data, status } = await this.baseQuery<T | message>({
      url: `/comments/${id}`,
    });

    if (status !== 200) {
      const { message } = data as message;

      throw { message };
    }

    return data as T;
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

  public async replyAComment({
    access_token,
    text,
    commentId,
  }: {
    access_token: string | undefined;
    text: string;
    commentId: string;
  }) {
    const { data, status } = await this.baseMutate<
      { id: string; message: string } | message
    >({
      url: `/reply/${commentId}`,
      headers: {
        access_token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
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

  public async getPostById(id: string) {
    const { data, status } = await this.baseQuery<timeLine | message>({
      url: `/post/${id}`,
    });

    if (status !== 200) throw { message: (data as message).message };

    return data;
  }
}

export default new PostApi();
