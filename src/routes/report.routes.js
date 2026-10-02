import express from "express";

import { generatePDF } from "../controllers/pdf.controller.js";

const reportRoutes = express.Router();

reportRoutes.post("/generate-pdf", generatePDF);

export default reportRoutes;
