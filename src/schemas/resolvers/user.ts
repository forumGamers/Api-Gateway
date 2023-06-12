import {
  registerInput,
  loginInput,
  tokenVerification,
} from "../../interfaces/user";
import { GlobalContext } from "../../interfaces";
import errorHandling from "../../middlewares/errorHandler";
import axios from "axios";
import { userUrl, eventUrl, storeUrl } from "../../constants";
import redis from "../../config/redis";
import { verifyToken } from "../../utils/jwt";

export const userResolver = {
  Query: {
    getUserData: async (_: never, args: never, context: GlobalContext) => {
      try {
        const id = verifyToken(context.access_token).id;
        const cache = await redis.get(`user:${id}`);

        if (cache) return JSON.parse(cache);

        const { data, status } = await axios({
          method: "GET",
          url: `${userUrl}/users/myData`,
          headers: {
            Origin: process.env.ORIGIN,
            access_token: context?.access_token,
          },
        });

        if (status !== 200) throw { message: data.message };

        if (data?.StoreId) {
          const { data: store } = await axios({
            method: "GET",
            url: `${storeUrl}/store/${data?.StoreId}`,
            headers: {
              Origin: process.env.ORIGIN,
              storeId: data.StoreId,
            },
          });

          data.Store = store;
        }

        await redis.set(`user:${data?.id}`, JSON.stringify(data));

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
  },

  Mutation: {
    register: async (_: never, args: { register: registerInput }) => {
      try {
        const { register } = args;

        const { data: userResponse, status } = await axios({
          method: "POST",
          url: `${userUrl}/auth/register`,
          data: register,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        if (status !== 201) throw { message: userResponse?.message };

        await axios({
          method: "POST",
          url: `${eventUrl}/user/register/${userResponse.id}`,
          data: {
            userName: userResponse.username,
            isVerified: userResponse.isVerified,
            email: userResponse.email,
          },
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        return { message: "success" };
      } catch (err) {
        errorHandling(err);
      }
    },
    login: async (_: never, args: { login: loginInput }) => {
      try {
        const { login } = args;

        const { data, status } = await axios({
          method: "POST",
          url: `${userUrl}/auth/login`,
          data: login,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        if (status !== 200) throw { message: data?.message };

        const { access_token, email, username, imageUrl } = data;

        return {
          access_token,
          email,
          username,
          imageUrl,
        };
      } catch (err) {
        errorHandling(err);
      }
    },
    verifyUser: async (_: never, args: { token: tokenVerification }) => {
      try {
        const { token } = args;

        const { data, status } = await axios({
          method: "PATCH",
          url: `${userUrl}/users/verify?token=${token.token}`,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        if (status !== 201) throw { message: data.message };

        return {
          message: data.message,
        };
      } catch (err) {
        errorHandling(err);
      }
    },
    resetPassword: async (_: never, args: { email: string }) => {
      try {
        const { email } = args;

        const { data: token } = await axios({
          method: "POST",
          url: `${userUrl}/auth/reset-password`,
          data: {
            email,
          },
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        await axios({
          method: "GET",
          url: `${eventUrl}/user/reset-password`,
          headers: {
            Origin: process.env.ORIGIN,
            access_token: token,
          },
        });

        return { message: "success" };
      } catch (err) {
        errorHandling(err);
      }
    },
    changeForgetPassword: async (
      _: never,
      args: {
        payload: {
          password: string;
          confirmPassword: string;
        };
      },
      context: GlobalContext
    ) => {
      try {
        const { payload } = args;

        const { data } = await axios({
          method: "PATCH",
          url: `${userUrl}/auth/change-forget-pass`,
          data: payload,
          headers: {
            access_token: context.access_token,
          },
        });

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
  },
};
