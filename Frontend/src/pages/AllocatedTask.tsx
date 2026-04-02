import { useEffect, useState } from 'react';
import { fetchTasks } from '../features/tasks/services/taskService';
import { Users, Briefcase, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AllocatedTask = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        fetchTasks()
            .then(data => {
                setTasks(data);
            })
            .catch(err => {
                console.error("Failed to fetch allocated tasks", err);
                toast.error("Failed to load allocation data");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Filter out unassigned tasks
    const allocatedTasks = tasks.filter(task => task.assignedTo);

    // Group tasks by user
    const usersWithTasks = allocatedTasks.reduce((acc, task) => {
        const userId = task.assignedTo._id;
        if (!acc[userId]) {
            acc[userId] = {
                user: task.assignedTo,
                tasks: []
            };
        }
        acc[userId].tasks.push(task);
        return acc;
    }, {} as Record<string, { user: any, tasks: any[] }>);

    const userArray = Object.values(usersWithTasks);

    return (
        <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">

                {/* Header Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Allocated Users</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Directory of employees actively working on tasks</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium border border-indigo-200 dark:border-indigo-800/30 flex items-center gap-2 pt-2 pb-2">
                                <Briefcase className="w-4 h-4" />
                                {userArray.length} Active Employees
                            </div>
                            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800/30 flex items-center gap-2 pt-2 pb-2">
                                <CheckSquare className="w-4 h-4" />
                                {allocatedTasks.length} Allocated Tasks
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users List Grid */}
                {userArray.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4 mx-auto" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No users are currently allocated to any tasks.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {userArray.map((record: any, index: number) => (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={record.user._id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
                            >
                                {/* User Header */}
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                                {record.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{record.user.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{record.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 flex flex-col items-center">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Workload</span>
                                            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{record.tasks.filter((t: any) => t.status !== 'completed').length}</span>
                                        </div>
                                    </div>
                                    {record.user.skills && record.user.skills.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {record.user.skills.map((skill: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* User Tasks */}
                                <div className="p-4 flex-1 bg-white dark:bg-gray-800">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-2 flex items-center gap-2">
                                        <CheckSquare className="w-4 h-4 text-gray-400" />
                                        Assigned Tasks
                                    </h4>
                                    <div className="space-y-3">
                                        {record.tasks.map((task: any) => (
                                            <div key={task._id} className="p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors bg-gray-50 dark:bg-gray-900/50">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h5 className="font-medium text-gray-900 dark:text-white text-sm truncate pr-2" title={task.title}>
                                                        {task.title}
                                                    </h5>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                        }`}>
                                                        {task.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                {task.priority && (
                                                    <div className="mt-2 flex gap-2">
                                                        <span className={`text-xs px-2 py-0.5 rounded-md ${task.priority === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30' :
                                                            task.priority === 'Medium' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30' :
                                                                'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                                                            }`}>
                                                            {task.priority || 'Normal'} Priority
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllocatedTask;