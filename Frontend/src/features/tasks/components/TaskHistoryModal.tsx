import React from "react";
import { createPortal } from "react-dom";
import { X, History, Trash2, CheckCircle2, Clock, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../../../store/useUserStore";

interface TaskHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: any[];
}

export const TaskHistoryModal: React.FC<TaskHistoryModalProps> = ({ isOpen, onClose, tasks }) => {
    const user = useUserStore((state) => state.user);

    if (!isOpen) return null;

    // Filter tasks based on role
    const historyTasks = tasks.filter((t) => {
        if (user?.role === "admin") {
            return t.isDeleted || t.status === "completed";
        } else {
            return (
                !t.isDeleted &&
                t.status === "completed" &&
                (t.assignedTo?._id === user?.id || t.assignedTo?.id === user?.id)
            );
        }
    });

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return "text-red-400 bg-red-400/10 border-red-400/20";
            case "medium":
                return "text-amber-400 bg-amber-400/10 border-amber-400/20";
            case "low":
                return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
            default:
                return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-3xl bg-gray-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="relative p-6 border-b border-white/5 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
                                        <History size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Task History</h2>
                                        <p className="text-xs text-indigo-400 font-medium">
                                            {user?.role === "admin"
                                                ? "View completed and deleted tasks"
                                                : "View your completed tasks"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar bg-black/50">
                            {historyTasks.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 italic">
                                    No task history available.
                                </div>
                            ) : (
                                historyTasks.map((task: any) => (
                                    <div
                                        key={task._id}
                                        className={`p-5 border ${
                                            task.isDeleted
                                                ? "border-red-500/20 bg-red-500/5"
                                                : "border-white/10 bg-white/5"
                                        } rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3
                                                    className={`font-bold text-lg ${
                                                        task.isDeleted ? "text-red-300" : "text-white"
                                                    }`}
                                                >
                                                    {task.title}
                                                </h3>
                                                <span
                                                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority?.toUpperCase()}
                                                </span>
                                                {task.isDeleted ? (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 uppercase">
                                                        <Trash2 size={12} /> Deleted
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase">
                                                        <CheckCircle2 size={12} /> Completed
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3">
                                                {(task.description || "").substring(0, 100)}
                                                {task.description?.length > 100 ? "..." : ""}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {task.requiredSkills?.map((skill: string, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="flex items-center gap-1 text-xs text-indigo-300 bg-indigo-900/30 px-2 py-1 rounded-md"
                                                    >
                                                        <Tag size={12} /> {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start md:items-end gap-2 text-sm text-gray-400 min-w-[150px]">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} className="text-purple-400" /> Due:{" "}
                                                {new Date(task.deadline).toLocaleDateString()}
                                            </span>
                                            {task.assignedTo && (
                                                <div className="mt-1 flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                        {task.assignedTo.name?.charAt(0)}
                                                    </div>
                                                    <span className="text-gray-300 font-medium text-xs truncate max-w-[100px]">
                                                        {task.assignedTo.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-6 bg-white/5 flex gap-3 border-t border-white/5">
                            <button
                                onClick={onClose}
                                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all text-sm"
                            >
                                Close History
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
