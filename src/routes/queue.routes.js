import express from "express";

import { clearPDFJobs, getPDFJobs } from "../controllers/queue.controller.js";

const queueRoutes = express.Router();

queueRoutes.get("/pdf-generation", getPDFJobs);
queueRoutes.delete("/pdf-generation", clearPDFJobs);

export default queueRoutes;
