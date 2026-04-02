import { useEffect, useState } from 'react';
import { fetchTaskRequests, updateTaskRequestStatus } from '../features/admin/services/adminService';
import { Check, X, ClipboardList, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const RequestPage = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        fetchTaskRequests()
            .then(data => setRequests(data))
            .catch(err => {
                console.error("Failed to fetch requests", err);
                toast.error("Failed to load requests");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAction = async (id: string, action: "approve" | "reject") => {
        try {
            await updateTaskRequestStatus(id, action);
            toast.success(`Request ${action}d!`);
            loadData();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
                
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                <ClipboardList className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Requests</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage and view all employee task assignment requests</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg text-sm font-medium border border-amber-200 dark:border-amber-800/30 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {requests.filter(r => r.status === 'pending').length} Pending
                            </div>
                            <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {requests.filter(r => r.status === 'approved').length} Approved
                            </div>
                        </div>
                    </div>
                </div>

                {/* Request List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden text-left">
                    {requests.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No task requests found in the system.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {requests.map((req) => (
                                <motion.div 
                                    key={req._id} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${req.status === 'pending' ? 'bg-amber-50/30 dark:bg-amber-900/5' : ''}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {req.task?.title || "Deleted Task"}
                                                </h3>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 ${
                                                    req.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                    req.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                                }`}>
                                                    {req.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                                                    {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                    {req.status === 'pending' && <Clock className="w-3 h-3" />}
                                                    {req.status}
                                                </span>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
                                                <p><span className="font-semibold text-gray-800 dark:text-gray-200">Requested by:</span> {req.user?.name} ({req.user?.email})</p>
                                                {req.task && (
                                                    <p className="text-gray-500 dark:text-gray-400 truncate max-w-2xl">{req.task.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        {req.status === 'pending' && req.task && (
                                            <div className="flex flex-row md:flex-col gap-2 min-w-[120px]">
                                                <button
                                                    onClick={() => handleAction(req._id, "approve")}
                                                    className="flex-1 w-full text-sm py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                                                >
                                                    <Check className="w-4 h-4" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req._id, "reject")}
                                                    className="flex-1 w-full text-sm py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-lg flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <X className="w-4 h-4" /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestPage;