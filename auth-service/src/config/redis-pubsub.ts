import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import { ENV } from "../env";

export const redisConnection = async () => {
  const options = {
    password: ENV.REDIS_PASS,
    port: 6379,
    host: "localhost",
    retryStrategy: (times: number) => {
      // reconnect after
      return Math.min(times * 50, 2000);
    },
  };
  console.log("INFO: connecting to redis ");
  return new RedisPubSub({
    subscriber: new Redis(options),
    publisher: new Redis(options),
    connectionListener: (err) => {
      if (err) {
        console.error(`ERROR: ${err}`);
      }
      console.info("INFO: redis pubsub succefully connected");
    },
  });
};
