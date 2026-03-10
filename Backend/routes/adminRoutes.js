const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getDashboardStates, getWorkloadDistribution } = require("../controllers/adminController");
const authorization = require("../middleware/roleMiddleware");

const router = express.Router()

router.get('/dashboard', protect, authorization("admin"), getDashboardStates)
router.get('/workload', protect, authorization("admin"), getWorkloadDistribution)

module.exports = router