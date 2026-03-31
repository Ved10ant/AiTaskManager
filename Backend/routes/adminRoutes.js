import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getDashboardStates, getWorkloadDistribution, getMembers, getRequests, updateRequestStatus } from "../controllers/adminController.js";
import authorization from "../middlewares/roleMiddleware.js";

const router = express.Router()

router.get('/dashboard', protect, authorization("admin"), getDashboardStates)
router.get('/workload', protect, authorization("admin"), getWorkloadDistribution)
router.get('/members', protect, authorization("admin"), getMembers)
router.get('/requests', protect, authorization("admin"), getRequests)
router.patch('/requests/:id', protect, authorization("admin"), updateRequestStatus)

export default router