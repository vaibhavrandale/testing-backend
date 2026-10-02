import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pdfQueue } from "../queues/pdf.queue.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDFDoc = async (reportId) => {
  console.log("Service: Generating PDF for reportId:", reportId);

  const directory = path.join(__dirname, "../reports");

  // Create directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {
      recursive: true,
    });
  }

  const filePath = path.join(directory, `report_${reportId}.pdf`);

  console.log("PDF path:", filePath);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);

    // PDF -> File
    doc.pipe(stream);

    // PDF content
    doc.fontSize(20).text(`Report ID: ${reportId}`);

    doc.moveDown();

    doc.fontSize(12).text(`Generated At: ${new Date().toLocaleString()}`);

    doc.moveDown();

    doc.text("This is a test PDF generated using PDFKit.");

    // Finish PDF generation
    doc.end();

    // PDF successfully written to disk
    stream.on("finish", () => {
      try {
        const stats = fs.statSync(filePath);

        console.log("PDF generated successfully:", filePath);

        console.log("PDF size:", stats.size, "bytes");

        resolve(filePath);
      } catch (error) {
        reject(error);
      }
    });

    stream.on("error", (error) => {
      reject(error);
    });

    doc.on("error", (error) => {
      reject(error);
    });
  });
};

export const clearPDFQueue = async () => {
  await pdfQueue.obliterate({
    force: true,
  });

  return {
    success: true,
    message: "PDF queue cleared successfully",
  };
};
