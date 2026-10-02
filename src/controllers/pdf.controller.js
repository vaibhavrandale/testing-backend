import { pdfQueue } from "../queues/pdf.queue.js";

export const generatePDF = async (req, res) => {
  try {
    const { email, reportId } = req.body;

    if (!email || !reportId) {
      return res.status(400).json({
        success: false,
        message: "email and reportId are required",
      });
    }

    const job = await pdfQueue.add("generate-report", {
      email,
      reportId,
    });

    return res.status(202).json({
      success: true,
      message: "PDF generation queued",
      jobId: job.id,
      reportId,
    });
  } catch (error) {
    console.error("PDF queue error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to queue PDF generation",
      error: error.message,
    });
  }
};
