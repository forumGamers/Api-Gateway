import { GlobalContext } from "../../interfaces";
import errorHandling from "../../middlewares/errorHandler";
import axios from "axios";
import { storeUrl, userReadURL } from "../../constants";
import redis from "../../config/redis";
import { verifyToken } from "../../utils/jwt";

export const storeResolver = {
  Query: {
    getUserStore: async (_: never, args: never, context: GlobalContext) => {
      try {
        const { access_token } = context;
        const id = verifyToken(access_token).id;

        const cache = await redis.get(`user:store:${id}`);

        if (cache) return JSON.parse(cache);

        const { data } = await axios({
          method: "GET",
          url: `${storeUrl}/store/my-store`,
          headers: {
            access_token,
            Origin: process.env.ORIGIN,
          },
        });

        const { data: follower } = await axios({
          method: "GET",
          url: `${userReadURL}/following-store/count/${data.ID}`,
          headers: {
            access_token,
            Origin: process.env.ORIGIN,
          },
        });
        const { count } = follower;

        data.followers = count;

        await redis.set(`user:store:${id}`, JSON.stringify(data));

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    getStoreByID: async (_: never, args: { id: string }) => {
      try {
        const { id } = args;

        const cache = await redis.get(`store:${id}`);

        if (cache) return JSON.parse(cache);

        const { data } = await axios({
          method: "GET",
          url: `${storeUrl}/store/${id}`,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        const { data: follower } = await axios({
          method: "GET",
          url: `${userReadURL}/following-store/count/${data.ID}`,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });
        const { count } = follower;

        data.followers = count;

        await redis.set(`store:${id}`, JSON.stringify(data));

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    getAllStoreId: async () => {
      try {
        const { data } = await axios({
          method: "GET",
          url: `${storeUrl}/store/store-id`,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });
        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    getAllSlugByStoreId: async (_: never, args: { id: string }) => {
      try {
        const { id } = args;

        const { data } = await axios({
          method: "GET",
          url: `${storeUrl}/item/list-slug/${id}`,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    getAllSlug: async () => {
      try {
        const { data } = await axios({
          method: "GET",
          url: `${storeUrl}/item/list-slug`,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });
        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    getItemBySlug: async (_: never, args: { slug: string }) => {
      try {
        const { slug } = args;

        const cache = await redis.get(`item:${slug}`);

        if (cache) return JSON.parse(cache);

        const { data } = await axios({
          method: "GET",
          url: `${storeUrl}/item/${slug}`,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        await redis.set(`item:${slug}`, JSON.stringify(data));

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
    getAllStore: async (
      _: never,
      args: {
        query: {
          name: string;
          minDate: string;
          maxDate: string;
          owner: string;
          active: string;
          minExp: string;
          maxExp: string;
          page: string;
          limit: string;
        };
      }
    ) => {
      try {
        const { query } = args;

        const { data } = await axios({
          method: "GET",
          url: `${storeUrl}/store`,
          headers: {
            Origin: process.env.ORIGIN,
          },
          params: query,
        });

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
  },
};
