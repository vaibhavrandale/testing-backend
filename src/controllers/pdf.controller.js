import { pdfQueue } from "../queues/pdfEmail.queue.js";

export const generatePDF = async (req, res) => {
  try {
    const { email, reportId } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    const job = await pdfQueue.add(
      "pdf-generation",
      {
        email,
        reportId,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );
    return res.status(202).json({
      success: true,
      message: "Report generation started",
      jobId: job.id,
    });
  } catch (err) {
    console.log(err);
    let message = err;
    return res.status(500).json({ success: false, message: message });
  }
};
