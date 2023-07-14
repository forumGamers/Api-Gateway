import { tourUrl } from "../../constants";
import errorHandling from "../../middlewares/errorHandler";
import axios from "axios";
import { GlobalContext } from "../../interfaces";
import redis from "../../config/redis";

export const tourResolver = {
  Query: {
    getUserAchievement: async (
      _: never,
      args: never,
      context: GlobalContext
    ) => {
      try {
        const { access_token } = context;

        const { data: datas } = await axios({
          method: "GET",
          url: `${tourUrl}/user-achievement`,
          headers: {
            access_token,
            Origin: process.env.ORIGIN,
          },
        });

        const resp = datas.map((data: any) => {
          return {
            Game: {
              id: data?.game?._id,
              name: data?.game?.name,
              type: data?.game?.type,
              image: data?.game?.image,
              description: data?.game?.description,
            },
            name: data?.achievement?.name,
            image: data?.achievement?.image,
            id: data?.achievement?._id,
          };
        });

        return resp;
      } catch (err) {
        errorHandling(err);
      }
    },
    getGameList: async () => {
      try {
        const cache = await redis.get("game:all");

        if (cache) return JSON.parse(cache);

        const { data } = await axios({
          method: "GET",
          url: `${tourUrl}/game`,
          headers: {
            Origin: process.env.ORIGIN,
          },
        });

        await redis.set("game:all", JSON.stringify(data));

        return data;
      } catch (err) {
        errorHandling(err);
      }
    },
  },
};
