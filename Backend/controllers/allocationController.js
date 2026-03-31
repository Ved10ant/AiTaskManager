import User from "../models/User.js";
import Task from "../models/Task.js";
import calculateScore from "../utils/allocationAlgorithm.js";

export const allocateTask = async (req, res) => {
    try {
        const { taskId, taskid, candidateId } = req.body;
        const targetTaskId = taskId || taskid; // Handle variable names from frontend

        if (!targetTaskId) {
            return res.status(400).json({ message: "Task ID is required" });
        }

        const task = await Task.findById(targetTaskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Phase 2: Actual Assignment Execution
        if (candidateId) {
            const employee = await User.findById(candidateId);
            if (!employee) return res.status(404).json({ message: "Employee not found" });

            task.assignedTo = employee._id;
            await task.save();

            employee.currentWorkload = (employee.currentWorkload || 0) + 1;
            await employee.save();

            return res.status(200).json({
                message: "Task Assigned Successfully",
                task
            });
        }

        // Phase 1: Best Candidate Discovery
        const employees = await User.find({ role: "employee" });
        let bestEmployee = null;
        let highestScore = -1;

        for (let employee of employees) {
            const score = calculateScore(employee, { requiredSkills: task.requiredSkills });
            if (score > highestScore) {
                highestScore = score;
                bestEmployee = employee;
            }
        }

        if (!bestEmployee) {
            return res.status(404).json({ message: "No suitable employee found" });
        }

        res.status(200).json({
            candidate: {
                id: bestEmployee._id,
                _id: bestEmployee._id,
                name: bestEmployee.name,
                skills: bestEmployee.skills
            },
            score: highestScore,
            reason: `Match based on skills (${task.requiredSkills.join(", ")}) and workload (${bestEmployee.currentWorkload})`
        });

    } catch (error) {
        res.status(500).json({ message: "Error allocating task", error: error.message });
        console.log(error);
    }
};