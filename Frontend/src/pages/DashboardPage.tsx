
import { useUserStore } from '../store/useUserStore';
import { Link } from 'react-router-dom';
import { useTasks } from '../features/tasks/hooks/useTasks';
import { BarChart3, CheckCircle, Clock, ListTodo } from 'lucide-react';
import { AdminMembers } from '../features/admin/components/AdminMembers';
import { AdminRequests } from '../features/admin/components/AdminRequests';
import { TaskList } from '../features/tasks/components/TaskList';
import { getBestCandidate } from '../features/allocation/services/allocationService';
import { useState } from 'react';
import BestCandidateModal from '../features/allocation/components/BestCandidateModal';

const DashboardPage = () => {
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [showBestCandidate, setShowBestCandidate] = useState(false);
    const handleRecommend = async (taskId: string) => {
        try {
            const data = await getBestCandidate(taskId);
            setSelectedTask({ ...data, _id: taskId });
            setShowBestCandidate(true);
        } catch (error) {
            console.error("Failed to fetch recommendation", error);
        }
    }

    const user = useUserStore((state) => state.user);
    const { tasks, loading, error } = useTasks();

    const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;

    return (
        <div className="min-h-screen bg-transparent text-gray-900 dark:text-white font-sans p-4 sm:p-6 md:p-8">
            <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center py-6 border-b border-indigo-200 dark:border-indigo-900/50 mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-purple-500">
                        Overview
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, <span className="text-gray-900 dark:text-white font-semibold">{user?.name}</span></p>
                </div>
                <div className="flex gap-4">
                    <Link to="/tasks" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-600/20 dark:text-indigo-300 dark:hover:bg-indigo-600/40 rounded-xl font-medium transition-all flex items-center gap-2 border border-indigo-200 dark:border-indigo-500/30 shadow-sm dark:shadow-none">
                        <ListTodo size={18} /> View Tasks
                    </Link>

                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                    <div className="p-4 bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 rounded-xl">
                        <BarChart3 size={28} />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Tasks</p>
                        <h2 className="text-3xl font-bold">{loading ? "..." : totalTasks}</h2>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                    <div className="p-4 bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 rounded-xl">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending Tasks</p>
                        <h2 className="text-3xl font-bold">{loading ? "..." : pendingTasks}</h2>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                    <div className="p-4 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-xl">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed</p>
                        <h2 className="text-3xl font-bold">{loading ? "..." : completedTasks}</h2>
                    </div>
                </div>
            </main>

            {user?.role === 'admin' && (
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-6 mt-8">
                    <div className="h-[500px] overflow-auto rounded-2xl">
                        <AdminMembers />
                    </div>
                    <div className="h-[500px] overflow-auto rounded-2xl">
                        <AdminRequests />
                    </div>
                </div>
            )}
            {
                user?.role === 'employee' && (
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-6 mt-8">
                        <TaskList tasks={tasks} loading={loading} error={error} onRecommend={handleRecommend} />
                    </div>
                )
            }
        </div>
    );
};

export default DashboardPage;