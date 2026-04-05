import React, { useState } from "react";
import { useTasks } from "../features/tasks/hooks/useTasks";
import { allocateTask, getBestCandidate } from "../features/allocation/services/allocationService";
import BestCandidateModal from "../features/allocation/components/BestCandidateModal";
import { TaskForm } from "../features/tasks/components/TaskForm";
import { TaskList } from "../features/tasks/components/TaskList";
import { ArrowLeft, LayoutDashboard, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

const TasksPage: React.FC = () => {
    const { tasks, loading, error, createTask } = useTasks();
    const user = useUserStore((state) => state.user);
    const [creating, setCreating] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [showBestCandidate, setShowBestCandidate] = useState(false);

    const handleCreate = async (payload: any) => {
        setCreating(true);
        try {
            const taskId = await createTask(payload);
            const allocationResult = await allocateTask(taskId._id);
            setShowBestCandidate(true);
            setSelectedTask(allocationResult);
        } catch (error) {
            console.error("Error creating task", error);
            alert("Error creating task");
        } finally {
            setCreating(false);
        }
    };

    const handleAssigned = (updatedTask: any) => {
        setSelectedTask(updatedTask);
        setShowBestCandidate(false);
        window.location.reload();
    };
    
    const handleRecommend = async (taskId: string) => {
        try {
            const data = await getBestCandidate(taskId);
            setSelectedTask({ ...data, _id: taskId });
            setShowBestCandidate(true);
        } catch (error) {
            console.error("Failed to fetch recommendation", error);
        }
    }

    return (
        <div className="min-h-screen bg-transparent text-gray-900 dark:text-white font-sans p-4 sm:p-6 pb-20">
            <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between py-6 border-b border-indigo-200 dark:border-indigo-900/50 gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <ArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-purple-500">
                            Central Task Hub
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2 text-sm"><Database size={14} className="text-purple-600 dark:text-purple-400"/> Synchronization Active</p>
                    </div>
                </div>
                {user?.role === 'admin' && (
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-2 border border-emerald-200 dark:border-emerald-500/20 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.05)] dark:shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        ● Admin Active
                    </div>
                )}
            </header>
            
            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LayoutDashboard className="text-purple-600 dark:text-purple-400" /> Active Tracking Board
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">View and monitor all intelligent assignments globally.</p>
                    <TaskList tasks={tasks} loading={loading} error={error} onRecommend={handleRecommend} />
                </div>
                
                {user?.role === 'admin' && (
                    <div className="order-first lg:order-last">
                        <div className="sticky top-6">
                            <TaskForm onSubmit={handleCreate} creating={creating} />
                        </div>
                    </div>
                )}
            </main>

            {showBestCandidate && selectedTask && (
                <BestCandidateModal
                    data={selectedTask} 
                    taskId={selectedTask._id}
                    onClose={() => setShowBestCandidate(false)}
                    onAssigned={handleAssigned}
                />
            )}
        </div>
    );
};

export default TasksPage;