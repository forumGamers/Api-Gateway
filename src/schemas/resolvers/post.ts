import errorHandling from "../../middlewares/errorHandler";
import { comment, timeLine, user } from "../../interfaces/post";
import { GlobalContext } from "../../interfaces";
import UserApi from "../../api/user";
import PostApi from "../../api/post";

export const postResolver = {
  Query: {
    getTimeLine: async () => {
      try {
        const timeLines = await PostApi.getPublicContent<timeLine[]>();

        const id = timeLines.map((el: timeLine) => el.userId).join(",");

        const users = await UserApi.getMultipleUserById<user[]>({ id });

        const data = timeLines.map((timeline: timeLine) => ({
          ...timeline,
          User: users.find((user) => user.id === timeline.userId),
        }));

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    getPostComment: async (_: never, args: { id: string }) => {
      try {
        const { id } = args;

        const data = await PostApi.getPostComment<comment[]>(id);

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
        const { id } = args;

        const data = await PostApi.likeAPost({ access_token, id });

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
        const { id } = args;

        const data = await PostApi.unlikeAPost({ access_token, id });

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
  },
};
