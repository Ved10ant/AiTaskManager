import express from "express";
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus, requestTask } from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";
import authorization from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.post("/", protect, authorization("admin"), createTask);
router.patch("/:id", protect, authorization("admin"), updateTask); 
router.delete("/:id", protect, authorization("admin"), deleteTask);
router.put("/:id/status", protect, updateTaskStatus);

router.post("/:id/request", protect, requestTask);

export default router;
