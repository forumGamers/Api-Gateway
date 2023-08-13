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

        const users = await UserApi.getMultipleUserById({ id });

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

        const post = await PostApi.getPostComment<comment[]>(id);

        const usersId = post
          .map((el: comment) => {
            const replyUserId = el.Reply.map((reply) => reply.userId);

            return [el._id, ...replyUserId].join(",");
          })
          .join(",");

        const users = await UserApi.getMultipleUserById({
          id: usersId,
        });

        const data = post.map((el: comment) => {
          const reply = el.Reply.map((val) => ({
            ...val,
            User: users.find((user) => user.id === val.userId),
          }));
          return {
            ...el,
            User: users.find((user) => user.id === el.userId),
            Reply: reply,
          };
        });

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    getPostById: async (_: never, args: { id: string }) => {
      try {
        const { id } = args;

        const data = await PostApi.getPostById(id);

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
    commentAPost: async (
      _: never,
      args: { text: string; postId: string },
      context: GlobalContext
    ) => {
      try {
        const { text, postId } = args;

        const { access_token } = context;

        const data = await PostApi.postAComment({
          access_token,
          text,
          postId,
        });

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    replyComment: async (
      _: never,
      args: { text: string; commentId: string },
      context: GlobalContext
    ) => {
      try {
        const { text, commentId } = args;

        const { access_token } = context;

        const data = await PostApi.replyAComment({
          access_token,
          text,
          commentId,
        });

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
  },
};
