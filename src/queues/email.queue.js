import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

export const emailQueue = new Queue("email-sending", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 5,

    backoff: {
      type: "exponential",
      delay: 30000,
    },

    removeOnComplete: {
      age: 60 * 60,
      count: 1000,
    },

    removeOnFail: {
      age: 24 * 60 * 60,
      count: 5000,
    },
  },
});
