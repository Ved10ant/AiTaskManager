import express from "express";
import { allocateTask, getBestCandidate } from "../controllers/allocationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import authorization from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorization("admin"), allocateTask);
router.get("/best-candidate/:taskId", protect, authorization("admin"), getBestCandidate);

export default router;