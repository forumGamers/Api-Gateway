import { eventUrl } from "../../constants";
import BaseRequest from "../request";

export default new (class Event extends BaseRequest {
  constructor() {
    super(eventUrl);
  }

  public async resetPasswordEmail(access_token: string) {
    const { data } = await this.baseMutate({
      method: "POST", //ganti juga yang di service nya
      url: "/user/reset-password",
      headers: { access_token },
    });

    return data;
  }
})();
