import User from "../models/User.js";
import Task from "../models/Task.js";

export const getDashboardStates = async (req, res) => {
    const totalEmployees = await User.countDocuments({ role: "employee" })
    const activeTasks = await Task.countDocuments(
        { status: { $in: ["active", 'pending'] } }
    )
    const completedTasks = await Task.countDocuments(
        { status: 'completed' }
    )
    const OverLoadEmployees = await User.countDocuments({
        status: "overloaded",
        currentWorkload: { $gt: 5 }
    })
    res.json({
        totalEmployees,
        activeTasks,
        completedTasks,
        OverLoadEmployees
    })
}
export const getWorkloadDistribution = async (req, res) => {
    const data = await User.aggregate([
        { $match: { role: "employee" } },
        {
            $group: {
                _id: "$currentWorkload",
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.json(data);
};

import TaskRequest from "../models/TaskRequest.js";

// Feature: Get Members
export const getMembers = async (req, res) => {
    try {
        const members = await User.find().select("-password");
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Failed to load members", error: error.message });
    }
};

// Feature: Task Requests Admin Management
export const getRequests = async (req, res) => {
    try {
        const requests = await TaskRequest.find()
            .populate('user', 'name email skills role currentWorkload')
            .populate('task', 'title description priority assignedTo status');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch task requests", error: error.message });
    }
};

export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // "approve" or "reject"
        
        // Use findByIdAndUpdate to completely bypass Mongoose save() and validation errors
        const request = await TaskRequest.findById(id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        let newStatus = action === "approve" ? "approved" : "rejected";
        if (action !== "approve" && action !== "reject") {
            return res.status(400).json({ message: "Invalid action" });
        }

        if (action === "approve") {
            // Assign task logically using direct database updates
            const task = await Task.findById(request.task);
            const user = await User.findById(request.user);

            if (task && user) {
                // Update task assignedTo
                await Task.findByIdAndUpdate(task._id, { assignedTo: user._id });

                // Increment user currentWorkload securely
                await User.findByIdAndUpdate(user._id, { 
                    $inc: { currentWorkload: 1 } 
                });
            }
        }

        // Update the request status
        await TaskRequest.findByIdAndUpdate(request._id, { status: newStatus });

        // Send a cleanly populated response back to frontend
        const updatedRequest = await TaskRequest.findById(request._id)
            .populate('task').populate('user');
            
        res.status(200).json({ message: `Request ${action}d successfully`, request: updatedRequest });
    } catch (error) {
        console.error("Update Request Error:", error);
        res.status(500).json({ message: "Failed to update request", error: error.message });
    }
};