exports.updateTaskStatus = async (req, res) => {
    const { title, requiredSkills } = req.body;
    if (!title || !requiredSkills || requiredSkills.length === 0) {
        return res.status(400).json({
            message: "Title and required skills are required"
        });
    }


    const tasks = await Task.find().populate("assignedTo", "name email skills");
    res.json(tasks);

    const task = await Task.findById(req.params.id).populate("assignedTo");

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = req.body.status;
    await task.save();

    if (req.body.status === "completed") {
        task.assignedTo.currentWorkload -= 1;
        task.assignedTo.performanceScore += 5;
        await task.assignedTo.save();
    }

    res.json(task);
};