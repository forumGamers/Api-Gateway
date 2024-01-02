import type {
  registerInput,
  loginInput,
  tokenVerification,
  UpdateProfileProps,
} from "../../interfaces/user";
import { GlobalContext } from "../../interfaces";
import errorHandling from "../../middlewares/errorHandler";
import axios from "axios";
import { userReadURL, storeUrl } from "../../constants";
import redis from "../../config/redis";
import jwt from "../../utils/jwt";
import UserApi from "../../api/user";
import userRead from "../../api/read/user";
import UserWrite from "../../api/write/user";
import event from "../../api/write/event";
import { base64ToBlob } from "../../utils/global";

export const userResolver = {
  Query: {
    getUserData: async (_: never, args: never, context: GlobalContext) => {
      try {
        const id = jwt.decodeToken(context.access_token || "").UUID;
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
      args: { userId: string },
      context: GlobalContext
    ) => {
      try {
        const { userId } = args;
        const { access_token } = context;

        const cache = await redis.get(`user:${userId}`);
        if (cache) return JSON.parse(cache);

        const user = await userRead.getUserById(userId, access_token);
        if (!user) throw { message: "Data not found" };

        redis.set(`user:${userId}`, JSON.stringify(user));

        return user;
      } catch (err) {
        return null;
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
    updateProfile: async (
      _: never,
      {
        data,
      }: {
        data: UpdateProfileProps;
      },
      { access_token }: GlobalContext
    ) => {
      try {
        const { UUID } = jwt.decodeToken(access_token as string);
        const handler: any[] = [];

        if (data.img) {
          const file = base64ToBlob(data.img, `profile-${UUID}`);
          if (file) {
            const formdata = new FormData();
            formdata.append("image", file.file, file.filename);
            handler.push(UserWrite.updateProfileImg(formdata, access_token));
          }
        }

        if (data.background) {
          const file = base64ToBlob(data.background, `background-${UUID}`);
          if (file) {
            const formdata = new FormData();
            formdata.append("image", file.file, file.filename);
            handler.push(UserWrite.updateBackgroundImg(formdata, access_token));
          }
        }

        if (data.username || data.bio) {
          handler.push(
            UserWrite.updateUserInfo(
              { username: data.username, bio: data.bio },
              access_token
            )
          );
        }

        if (handler.length) {
          await Promise.all(handler);
          const id = jwt.decodeToken(access_token || "").UUID;
          redis.del(`user:${id}`);
        }

        return {
          message: "ok",
        };
      } catch (err) {
        errorHandling(err);
      }
    },
  },
};
