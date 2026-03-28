import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getDashboardStates, getWorkloadDistribution } from "../controllers/adminController.js";
import authorization from "../middlewares/roleMiddleware.js";

const router = express.Router()

router.get('/dashboard', protect, authorization("admin"), getDashboardStates)
router.get('/workload', protect, authorization("admin"), getWorkloadDistribution)


export default router