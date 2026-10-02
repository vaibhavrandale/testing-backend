import express from "express";
import dotenv from "dotenv";
import { generatePDF } from "./controllers/pdf.controller.js";
import "./workers/pdfEmail.worker.js";
import queueRoutes from "./routes/queue.routes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/jobs", queueRoutes);
app.post("/api/reports/generate-pdf", generatePDF);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
