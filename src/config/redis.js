import Redis from "ioredis";

/** Shared connection options — BullMQ must create its own clients from these. */
export const redisConnectionOptions = {
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
};

const redisConnection = new Redis(redisConnectionOptions);

export default redisConnection;
