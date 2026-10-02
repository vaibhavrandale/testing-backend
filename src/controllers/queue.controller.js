import { getPDFQueueStatus } from "../queues/pdfEmail.queue.js";
import { clearPDFQueue } from "../services/pdf.service.js";

export const getPDFJobs = async (req, res) => {
  try {
    const result = await getPDFQueueStatus();

    return res.status(200).json({
      success: true,
      ...result,
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

export const clearPDFJobs = async (req, res) => {
  try {
    const result = await clearPDFQueue();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Clear queue error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear PDF queue",
      error: error.message,
    });
  }
};
