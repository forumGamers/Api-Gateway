import axios from "axios";
import errorHandling from "../../middlewares/errorHandler";
import { postUrl, userUrl } from "../../constants";
import { timeLine, user } from "../../interfaces/post";
import { GlobalContext } from "../../interfaces";

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
        console.log({ data });

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    getPostComment: async (_: never, args: { id: string }) => {
      try {
        const { id } = args;

        const { data } = await axios({
          method: "GET",
          url: `${postUrl}/comment/${id}`,
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
  Mutation: {
    likeAPost: async (
      _: never,
      args: { id: string },
      context: GlobalContext
    ) => {
      try {
        const { access_token } = context;
        console.log({ access_token, args });

        const { data } = await axios({
          method: "POST",
          url: `${postUrl}/like/${args}`,
          headers: {
            access_token,
            Origin: process.env.ORIGIN,
          },
        });

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    unLikeAPost: async (
      _: never,
      args: { id: string },
      context: GlobalContext
    ) => {
      try {
        const { access_token } = context;

        const { data } = await axios({
          method: "DELETE",
          url: `${postUrl}/like/${args.id}`,
          headers: {
            access_token,
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
