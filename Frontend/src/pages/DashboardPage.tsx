
import { useUserStore } from '../store/useUserStore';
import { useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../features/tasks/hooks/useTasks';
import { BarChart3, CheckCircle, Clock, ListTodo, LogOut } from 'lucide-react';
import { AdminMembers } from '../features/admin/components/AdminMembers';
import { AdminRequests } from '../features/admin/components/AdminRequests';

const DashboardPage = () => {
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();
    const { tasks, loading } = useTasks();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;

    return (
        <div className="min-h-screen bg-[#07051A] text-white font-sans p-6">
            <header className="max-w-6xl mx-auto flex justify-between items-center py-6 border-b border-indigo-900/50 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                        Overview
                    </h1>
                    <p className="text-gray-400 mt-1">Welcome back, <span className="text-white font-semibold">{user?.name}</span></p>
                </div>
                <div className="flex gap-4">
                    <Link to="/tasks" className="px-5 py-2.5 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 rounded-xl font-medium transition-all flex items-center gap-2 border border-indigo-500/30">
                        <ListTodo size={18} /> View Tasks
                    </Link>

                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white/10 transition-colors">
                    <div className="p-4 bg-purple-500/20 text-purple-400 rounded-xl">
                        <BarChart3 size={28} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-medium">Total Tasks</p>
                        <h2 className="text-3xl font-bold">{loading ? "..." : totalTasks}</h2>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white/10 transition-colors">
                    <div className="p-4 bg-amber-500/20 text-amber-400 rounded-xl">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-medium">Pending Tasks</p>
                        <h2 className="text-3xl font-bold">{loading ? "..." : pendingTasks}</h2>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white/10 transition-colors">
                    <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-medium">Completed</p>
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
        </div>
    );
};

export default DashboardPage;