import axios from "axios";
import errorHandling from "../../middlewares/errorHandler";
import { postUrl } from "../../constants";

export const postResolver = {
  Query: {
    getTimeLine: async () => {
      try {
        const { data } = await axios({
          method: "GET",
          url: `${postUrl}/post/public-content`,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
  },
};
