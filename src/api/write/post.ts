import { postWriteUrl } from "../../constants";
import BaseRequest, { BaseResponse } from "../request";

export default new (class PostWrite extends BaseRequest {
  constructor() {
    super(postWriteUrl);
  }

  public async likePost(id: string, access_token: string | undefined) {
    const { data, status } = await this.baseMutate<BaseResponse>({
      url: `/like/${id}`,
      method: "POST",
      headers: {
        access_token,
      },
    });
    const { message } = data;

    if (status !== 201) throw { message };

    return message;
  }
})();
