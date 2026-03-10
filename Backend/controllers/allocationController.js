import User from "../models/User.js";
import Task from "../models/Task.js";
import calculateScore from "../utils/allocationAlgorithm.js";

export const allocateTask = async (req, res) => {
    try {
        const { title, description, requiredSkills, priority, deadline } = req.body;
        const employees = await User.find({ role: "employee" });
        let bestEmployee = null;
        let highestScore = 0;

        for (let employee of employees) {
            const score = calculateScore(employee, { requiredSkills });
            if (score > highestScore) {
                highestScore = score;
                bestEmployee = employee;
            }
        }

        if (!bestEmployee) {
            return res.status(404).json({ message: "No suitable employee found" });
        }

        const task = await Task.create({
            title,
            description,
            requiredSkills,
            priority,
            deadline,
            assignedTo: bestEmployee._id
        });

        bestEmployee.currentWorkload += 1;
        await bestEmployee.save();

        res.status(201).json({
            message: "Task Assigned Successfully",
            assignedTo: bestEmployee.name,
            task
        });

    } catch (error) {
        res.status(500).json({ message: "Error allocating task", error: error.message });
        console.log(error);
    }
};