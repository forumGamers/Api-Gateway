import errorHandling from "../../middlewares/errorHandler";
import type { PostDataParams, comment, timeLine } from "../../interfaces/post";
import { GlobalContext } from "../../interfaces";
import userRead from "../../api/read/user";
import PostApi from "../../api/post";
import post from "../../api/read/post";
import postWrite from "../../api/write/post";
import jwt from "../../utils/jwt";
import redis from "../../config/redis";

export const postResolver = {
  Query: {
    getTimeLine: async (
      _: never,
      args: {
        query: PostDataParams;
      },
      context: GlobalContext
    ) => {
      try {
        const { access_token } = context;

        const timeLines = await post.getPostData(
          { ...args.query },
          access_token
        );

        const ids = timeLines.map((el: timeLine) => el.userId).join(",");

        const users = await userRead.getMultipleUserById({ ids });

        const data = timeLines.map((timeline: timeLine) => ({
          ...timeline,
          User: users.find((user) => user.id === timeline.userId),
        }));

        return data.map((el) => ({
          ...el,
          User: {
            ...el.User,
            UUID: el.User?.id,
            backgroundImage: el?.User?.background_url,
            imageUrl: el?.User?.image_url,
          },
        }));
      } catch (err) {
        return [];
      }
    },
    getPostComment: async (
      _: never,
      args: { id: string; param: { page: string; limit: string } },
      ctx: GlobalContext
    ) => {
      try {
        const { id, param } = args;

        const comments = await post.getPostComments(
          id,
          param,
          ctx.access_token
        );

        const usersId = comments.map((el: comment) => el.userId).join(",");

        const users = await userRead.getMultipleUserById({
          ids: usersId,
        });

        const data = comments.map((el: comment) => {
          const reply = (el.reply || []).map((val) => ({
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
        return [];
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
    getMyPost: async (
      _: never,
      args: {
        query: PostDataParams;
      },
      ctx: GlobalContext
    ) => {
      try {
        const { access_token } = ctx;

        const id = jwt.decodeToken(access_token || "").UUID;
        const cache = await redis.get(`user-post-me:${id}`);
        if (cache) return JSON.parse(cache);

        const timeLines = await post.getMyPost({ ...args.query }, access_token);

        const ids = timeLines.map((el: timeLine) => el.userId).join(",");

        const users = await userRead.getMultipleUserById({ ids });

        const data = timeLines.map((timeline: timeLine) => ({
          ...timeline,
          User: users.find((user) => user.id === timeline.userId),
        }));

        const result = data.map((el) => ({
          ...el,
          User: {
            ...el.User,
            UUID: el.User?.id,
            backgroundImage: el?.User?.background_url,
            imageUrl: el?.User?.image_url,
          },
        }));

        redis.set(`user-post-me:${id}`, JSON.stringify(result));

        return result;
      } catch (err) {
        return [];
      }
    },
    getMedia: async (
      _: never,
      args: {
        query: PostDataParams;
      },
      ctx: GlobalContext
    ) => {
      try {
        const { access_token } = ctx;

        const id = jwt.decodeToken(access_token || "").UUID;
        const cache = await redis.get(`user-post-me-media:${id}`);
        if (cache) return JSON.parse(cache);

        const timeLines = await post.getMedia({ ...args.query }, access_token);

        const ids = timeLines.map((el: timeLine) => el.userId).join(",");

        const users = await userRead.getMultipleUserById({ ids });

        const data = timeLines.map((timeline: timeLine) => ({
          ...timeline,
          User: users.find((user) => user.id === timeline.userId),
        }));

        const result = data.map((el) => ({
          ...el,
          User: {
            ...el.User,
            UUID: el.User?.id,
            backgroundImage: el?.User?.background_url,
            imageUrl: el?.User?.image_url,
          },
        }));

        redis.set(`user-post-me-media:${id}`, JSON.stringify(result));
        return result;
      } catch (err) {
        return [];
      }
    },
    getMyLikedPost: async (
      _: never,
      args: {
        query: PostDataParams;
      },
      ctx: GlobalContext
    ) => {
      try {
        const { access_token } = ctx;

        const id = jwt.decodeToken(access_token || "").UUID;
        const cache = await redis.get(`user-post-me-liked:${id}`);
        if (cache) return JSON.parse(cache);

        const timeLines = await post.getMedia({ ...args.query }, access_token);

        const ids = timeLines.map((el: timeLine) => el.userId).join(",");

        const users = await userRead.getMultipleUserById({ ids });

        const data = timeLines.map((timeline: timeLine) => ({
          ...timeline,
          User: users.find((user) => user.id === timeline.userId),
        }));

        const result = data.map((el) => ({
          ...el,
          User: {
            ...el.User,
            UUID: el.User?.id,
            backgroundImage: el?.User?.background_url,
            imageUrl: el?.User?.image_url,
          },
        }));
        return result;
      } catch (err) {
        return [];
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
        return await postWrite.likePost(args.id, context.access_token);
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
