import axios from "axios";
import errorHandling from "../../middlewares/errorHandler";
import { postUrl, userUrl } from "../../constants";
import { timeLine, user } from "../../interfaces/post";

export const postResolver = {
  Query: {
    getTimeLine: async () => {
      try {
        const { data: timeLines } = await axios<timeLine[]>({
          method: "GET",
          url: `${postUrl}/post/public-content`,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        const id = timeLines.map((el: timeLine) => el.userId).join(",");

        const { data: users } = await axios<user[]>({
          method: "GET",
          url: `${userUrl}/users/multiple`,
          headers: {
            Origin: process.env.ORIGIN,
          },
          params: {
            id,
          },
        });

        const data = timeLines.map((timeline: timeLine) => ({
          ...timeline,
          User: users.find((user) => user.id === timeline.userId),
        }));

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
  },
};
