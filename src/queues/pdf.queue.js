import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

export const pdfQueue = new Queue("pdf-generation", {
  connection: redisConnection,
});

const formatJob = (job) => ({
  id: job.id,
  name: job.name,
  data: job.data,

  progress: job.progress,

  attemptsMade: job.attemptsMade,

  timestamp: job.timestamp,
  processedOn: job.processedOn,
  finishedOn: job.finishedOn,

  failedReason: job.failedReason,

  returnvalue: job.returnvalue,
});

export const getPDFQueueStatus = async () => {
  const counts = await pdfQueue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
    "delayed",
  );

  const [waiting, active, completed, failed, delayed] = await Promise.all([
    pdfQueue.getWaiting(0, 100),
    pdfQueue.getActive(0, 100),
    pdfQueue.getCompleted(0, 100),
    pdfQueue.getFailed(0, 100),
    pdfQueue.getDelayed(0, 100),
  ]);

  return {
    queue: "pdf-generation",

    counts,

    jobs: {
      waiting: waiting.map(formatJob),
      active: active.map(formatJob),
      completed: completed.map(formatJob),
      failed: failed.map(formatJob),
      delayed: delayed.map(formatJob),
    },
  };
};
