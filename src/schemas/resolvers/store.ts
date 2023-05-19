import { GlobalContext } from "../../interfaces";
import errorHandling from "../../middlewares/errorHandler";
import axios from "axios";
import { storeUrl } from "../../constants";
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

        await redis.set(`user:store:${id}`, JSON.stringify(data));

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
  },
};
