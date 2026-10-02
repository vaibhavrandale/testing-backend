import express from "express";
import {
  clearQueues,
  getQueuesStatus,
} from "../controllers/queue.controller.js";

const queueRoutes = express.Router();

queueRoutes.get("/status", getQueuesStatus);

queueRoutes.delete("/clear", clearQueues);

export default queueRoutes;
