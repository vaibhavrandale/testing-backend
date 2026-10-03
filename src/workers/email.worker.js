import "dotenv/config";

import fs from "fs";

import { Worker } from "bullmq";

import redisConnection from "../config/redis.js";

import { sendReportEmail } from "../services/email.service.js";

const worker = new Worker(
  "email-sending",

  async (job) => {
    console.log(`Email Worker processing job ${job.id}`);

    const { email, reportId, pdfPath } = job.data;

    console.log("Sending email to:", email);

    try {
      const info = await sendReportEmail({
        to: email,
        subject: `Report ${reportId}`,
        text: `Please find the report attached.Report ID: ${reportId}`,
        attachment: pdfPath,
      });

      console.log(`Email successfully sent for job ${job.id}`);

      return {
        success: true,
        status: "sent",
        reportId,
        messageId: info.messageId,
      };
    } finally {
    }
  },

  {
    connection: redisConnection,
    concurrency: 1,
  },
);

worker.on("completed", async (job) => {
  console.log(`Email job ${job.id} completed`);

  const { pdfPath } = job.data;

  if (pdfPath && fs.existsSync(pdfPath)) {
    fs.unlinkSync(pdfPath);

    console.log("Temporary PDF deleted:", pdfPath);
  }
});

worker.on("failed", async (job, error) => {
  console.error(`Email job ${job?.id} failed:`, error.message);
});

console.log("Email Worker started...");
