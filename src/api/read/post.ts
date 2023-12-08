import { postReadUrl } from "../../constants";
import { PostDataParams, comment, timeLine } from "../../interfaces/post";
import BaseRequest, { GoResponseWithMetadata } from "../request";

export default new (class PostRead extends BaseRequest {
  constructor() {
    super(postReadUrl);
  }

  public async getPostData(params: PostDataParams, access_token?: string) {
    const { data, status } = await this.baseQuery<
      GoResponseWithMetadata<timeLine[]>
    >({
      url: `/post/public`,
      params,
      headers: {
        access_token,
      },
    });

    if (status !== 200) throw { message: data.message };

    return data.data as timeLine[];
  }

  public async getMyPost(params: PostDataParams, access_token?: string) {
    const { data, status } = await this.baseQuery<
      GoResponseWithMetadata<timeLine[]>
    >({
      url: `/post/me`,
      params,
      headers: {
        access_token,
      },
    });

    if (status !== 200) throw { message: data.message };

    return data.data as timeLine[];
  }

  public async getMedia(params: PostDataParams, access_token?: string) {
    const { data, status } = await this.baseQuery<
      GoResponseWithMetadata<timeLine[]>
    >({
      url: `/post/media`,
      params,
      headers: {
        access_token,
      },
    });

    if (status !== 200) throw { message: data.message };

    return data.data as timeLine[];
  }

  public async getLikedPost(params: PostDataParams, access_token?: string) {
    const { data, status } = await this.baseQuery<
      GoResponseWithMetadata<timeLine[]>
    >({
      url: `/post/liked`,
      params,
      headers: {
        access_token,
      },
    });

    if (status !== 200) throw { message: data.message };

    return data.data as timeLine[];
  }

  public async getPostComments(
    id: string,
    params: { page: string; limit: string },
    access_token?: string
  ) {
    const { data, status } = await this.baseQuery<
      GoResponseWithMetadata<comment[]>
    >({
      url: `/comments/${id}`,
      headers: {
        access_token,
      },
      params,
    });

    if (status !== 200) throw { message: data.message };

    return data.data as comment[];
  }
})();
