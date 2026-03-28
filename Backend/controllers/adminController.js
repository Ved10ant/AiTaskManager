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