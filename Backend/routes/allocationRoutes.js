import express from "express";
import { allocateTask } from "../controllers/allocationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import authorization from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorization("admin") , allocateTask);

export default router;