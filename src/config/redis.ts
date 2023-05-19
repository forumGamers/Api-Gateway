import Redis from "ioredis";
import { config } from "dotenv";
config();

const redis = new Redis({
  host: process.env.REDIS_HOST as string,
  port: 11677,
  username: process.env.REDIS_USERNAME as string,
  password: process.env.REDIS_PASS as string,
});

redis.on("error", (err: Error) => console.log(err));

export default redis;
