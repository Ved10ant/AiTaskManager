import express from "express";
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.patch("/:id", protect, updateTask); // Use patch as per frontend service
router.delete("/:id", protect, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);

export default router;
