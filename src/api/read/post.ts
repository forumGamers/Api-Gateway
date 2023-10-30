import { postReadUrl } from "../../constants";
import { PostDataParams, timeLine } from "../../interfaces/post";
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
})();
