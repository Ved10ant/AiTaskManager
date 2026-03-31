import mongoose from "mongoose";

const taskRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);

export default mongoose.model("TaskRequest", taskRequestSchema);
