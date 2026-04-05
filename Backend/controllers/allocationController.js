import User from "../models/User.js";
import Task from "../models/Task.js";
import { findBestCandidate } from "../services/allocationService.js";

export const allocateTask = async (req, res) => {
    try {
        console.log("Allocation request received:", req.body);
        const { taskId, taskid, candidateId } = req.body;
        const targetTaskId = taskId || taskid;

        if (!targetTaskId) {
            console.error("No Task ID provided in request");
            return res.status(400).json({ message: "Task ID is required for allocation discovery" });
        }

        const task = await Task.findById(targetTaskId);
        if (!task) {
            console.error(`Task not found: ${targetTaskId}`);
            return res.status(404).json({ message: "Specified task was not found in database" });
        }

        // Phase 2: Direct Assignment
        if (candidateId) {
            console.log(`Manually assigning candidate ${candidateId} to task ${targetTaskId}`);
            const employee = await User.findById(candidateId);
            if (!employee) return res.status(404).json({ message: "Employee not found or invalid candidate" });

            task.assignedTo = employee._id;
            task.status = "in-progress";
            await task.save();

            employee.currentWorkload = (employee.currentWorkload || 0) + 1;
            await employee.save();

            if (req.io) {
                req.io.emit("notification", {
                    userId: employee._id,
                    message: `New task assigned: ${task.title}`,
                    type: "task_assignment"
                });
            }

            return res.status(200).json({
                message: "Confirmation Successful! Task Assigned.",
                task
            });
        }

        // Phase 1: AI Discovery or Automated Match
        console.log(`Triggering AI Discovery for task: ${task.title}`);
        const result = await findBestCandidate(task);
        console.log("Best candidate discovered:", result.candidate?.name || "None");

        if (!result.candidate) {
            return res.status(404).json({ message: "No eligible employees found for this task profile." });
        }

        // Update task with AI-suggested skills if empty
        if (!task.requiredSkills || task.requiredSkills.length === 0) {
            task.requiredSkills = result.aiInsights?.requiredSkills || [];
            await task.save();
        }

        res.status(200).json({
            candidate: result.candidate,
            score: result.score,
            aiInsights: result.aiInsights,
            reason: `AI Match: ${(result.aiInsights?.requiredSkills || []).join(", ") || "General Skills"} | Score: ${(result.score * 100).toFixed(1)}%`
        });

    } catch (error) {
        console.error("CRITICAL ERROR IN ALLOCATION:", error);
        res.status(500).json({ 
            message: "Internal error in task discovery workflow", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getBestCandidate = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const result = await findBestCandidate(task);
    res.json(result);
  } catch (error) {
    console.error("GET BEST CANDIDATE ERROR:", error);
    res.status(500).json({ message: "Error finding candidate", error: error.message });
  }
};