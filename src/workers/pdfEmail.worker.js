import { Worker } from "bullmq";
import fs from "fs";

import redisConnection from "../config/redis.js";
import { generatePDFDoc } from "../services/pdf.service.js";
import { sendReportEmail } from "../services/email.service.js";

const worker = new Worker(
  "pdf-generation",
  async (job) => {
    console.log(`Processing job ${job.id}`);

    const { email, reportId } = job.data;
    console.log("Generating PDF for reportId:", reportId);
    const pdfPath = await generatePDFDoc(reportId);
    console.log("PDF generated successfully:", pdfPath);

    console.log("Sending email...");

    await sendReportEmail({
      to: email,
      subject: `Report ${reportId}`,
      text: `Please find the report attached.`,
      attachment: pdfPath,
    });
    console.log(`Email sent to ${email}`);

    // Delete temporary PDF
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    return {
      success: true,
      reportId,
    };
  },
  {
    connection: redisConnection,
    concurrency: 3,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error`, err);
});

console.log("PDF Worker started...");
