import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email skills");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, description, requiredSkills, deadline, priority } = req.body;
        const task = await Task.create({
            title,
            description,
            requiredSkills,
            deadline,
            priority,
            createdBy: req.user.id
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("assignedTo");

        if (!task) return res.status(404).json({ message: "Task not found" });

        task.status = req.body.status;
        await task.save();

        if (req.body.status === "completed" && task.assignedTo) {
            task.assignedTo.currentWorkload = Math.max(0, (task.assignedTo.currentWorkload || 0) - 1);
            task.assignedTo.performanceScore = (task.assignedTo.performanceScore || 0) + 5;
            await task.assignedTo.save();
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task status", error: error.message });
    }
};