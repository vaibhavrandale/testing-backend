import { pdfQueue } from "../queues/pdf.queue.js";
import { emailQueue } from "../queues/email.queue.js";

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

const getQueueStatus = async (queue) => {
  const counts = await queue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
    "delayed",
  );

  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaiting(0, 100),
    queue.getActive(0, 100),
    queue.getCompleted(0, 100),
    queue.getFailed(0, 100),
    queue.getDelayed(0, 100),
  ]);

  return {
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

export const getQueuesStatus = async (req, res) => {
  try {
    const [pdf, email] = await Promise.all([
      getQueueStatus(pdfQueue),
      getQueueStatus(emailQueue),
    ]);

    return res.status(200).json({
      success: true,

      queues: {
        pdfGeneration: pdf,
        emailSending: email,
      },
    });
  } catch (error) {
    console.error("Queue status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get queue status",
      error: error.message,
    });
  }
};
export const clearQueues = async (req, res) => {
  try {
    await pdfQueue.obliterate({
      force: true,
    });

    await emailQueue.obliterate({
      force: true,
    });

    return res.status(200).json({
      success: true,
      message: "PDF and Email queues cleared",
    });
  } catch (error) {
    console.error("Queue clear error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear queues",
      error: error.message,
    });
  }
};
