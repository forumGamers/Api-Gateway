import {
  registerInput,
  loginInput,
  tokenVerification,
} from "../../interfaces/user";
import { GlobalContext } from "../../interfaces";
import errorHandling from "../../middlewares/errorHandler";
import axios from "axios";
import { userReadURL, eventUrl, storeUrl } from "../../constants";
import redis from "../../config/redis";
import { verifyToken } from "../../utils/jwt";
import UserApi from "../../api/user";
import userRead from "../../api/read/user";
import UserWrite from "../../api/write/user";
import event from "../../api/write/event";

export const userResolver = {
  Query: {
    getUserData: async (_: never, args: never, context: GlobalContext) => {
      try {
        const id = verifyToken(context.access_token).id;
        const cache = await redis.get(`user:${id}`);

        if (cache) return JSON.parse(cache);

        const { data, status } = await axios({
          method: "GET",
          url: `${userReadURL}/users/myData`,
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
    getUserById: async (
      _: never,
      args: { ids: string },
      context: GlobalContext
    ) => {
      try {
        const { ids } = args;
        const { access_token } = context;

        const cache = await redis.get(`user:${ids.split(",")[0]}`);
        if (cache) return JSON.parse(cache);

        const [user] = await userRead.getMultipleUserById(
          { ids },
          access_token
        );

        if (!user) throw { message: "Data not found" };
        redis.set(`user:${ids.split(",")[0]}`, JSON.stringify(user));

        return user;
      } catch (err) {
        errorHandling(err);
      }
    },
    getUserByToken: async (_: never, args: never, context: GlobalContext) => {
      try {
        const { access_token } = context;

        const cache = await redis.get(`user:token:${access_token}`);
        if (cache) return JSON.parse(cache);

        const user = await userRead.getUserData(access_token as string);

        redis.set(`user:token:${access_token}`, JSON.stringify(user));
        return user;
      } catch (err) {
        errorHandling(err);
      }
    },
    getFollowingRecomendation: async (
      _: never,
      args: never,
      context: GlobalContext
    ) => {
      try {
        return await userRead.getFollowingRecomendation(context.access_token);
      } catch (err) {
        return [];
      }
    },
  },

  Mutation: {
    register: async (_: never, args: { register: registerInput }) => {
      try {
        const { register } = args;

        event.registerEmail(await UserWrite.register(register));

        return { message: "success" };
      } catch (err) {
        errorHandling(err);
      }
    },
    login: async (
      _: never,
      args: { login: loginInput },
      context: GlobalContext
    ) => {
      try {
        const { login } = args;
        const { access_token: captchaToken } = context;
        const { email, password } = login;

        const { data: valid } = await axios.post<{
          success: boolean;
          challenge_ts: string;
          hostname?: string;
          apk_package_name?: string;
          "error-codes"?: any[];
        }>("https://www.google.com/recaptcha/api/siteverify", null, {
          params: {
            secret: process.env.CAPTCHA_SECRET_KEY,
            response: captchaToken,
          },
        });

        const { success, "error-codes": errorCode } = valid;

        if (!success && errorCode)
          throw {
            message: errorCode[0],
          };

        return await UserWrite.loginHandler({ email, password });
      } catch (err) {
        errorHandling(err);
      }
    },
    verifyUser: async (_: never, args: { token: tokenVerification }) => {
      try {
        const { token } = args;

        return await UserWrite.verifyUser(token.token);
      } catch (err) {
        errorHandling(err);
      }
    },
    resetPassword: async (_: never, args: { email: string }) => {
      try {
        const { email } = args;

        event.resetPasswordEmail(await UserWrite.resetPassword(email));

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

        return await UserWrite.changeForgetPassword(
          payload,
          context.access_token as string
        );
      } catch (err) {
        errorHandling(err);
      }
    },
    googleLogin: async (_: never, args: never, context: GlobalContext) => {
      try {
        const { access_token } = context;

        return await UserWrite.googleLogin(access_token as string);
      } catch (err) {
        errorHandling(err);
      }
    },
    followAUser: async (
      _: never,
      args: { id: string },
      context: GlobalContext
    ) => {
      try {
        const { id } = args;

        const { access_token } = context;

        const data = await UserApi.followAUser(id, access_token);

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    unFollowAUser: async (
      _: never,
      args: { id: string },
      context: GlobalContext
    ) => {
      try {
        const { id } = args;

        const { access_token } = context;

        const data = await UserApi.unFollowAUser(id, access_token);

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
  },
};
