import React, { useEffect, useState } from "react";
import { fetchTaskRequests, updateTaskRequestStatus } from "../services/adminService";
import { Handshake, Check, X } from "lucide-react";
import toast from "react-hot-toast";

export const AdminRequests = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        fetchTaskRequests()
            .then(data => setRequests(data))
            .catch(err => console.error("Failed to fetch requests", err))
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

    if (loading) return <div className="animate-pulse text-gray-400">Loading requests...</div>;

    const pendingRequests = requests.filter(r => r.status === 'pending');

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <h2 className="text-xl font-bold flex items-center justify-between gap-2 mb-6">
                <span className="flex items-center gap-2"><Handshake className="text-amber-400" /> Incoming Requests</span>
                {pendingRequests.length > 0 && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">{pendingRequests.length} pending</span>}
            </h2>

            <div className="space-y-4 flex-1 overflow-auto pr-2">
                {requests.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center italic mt-10">No requests found in the system.</p>
                ) : (
                    requests.map(req => (
                        <div key={req._id} className={`p-4 rounded-xl border ${req.status === 'pending' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/5'} transition-all`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-white text-sm truncate max-w-[200px]">{req.task?.title || "Deleted Task"}</h3>
                                    <p className="text-xs text-cyan-300 mt-0.5">Requested by {req.user?.name}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                        req.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                            'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    {req.status}
                                </span>
                            </div>

                            {req.status === 'pending' && req.task && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => handleAction(req._id, "approve")}
                                        className="flex-1 text-xs py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 border border-emerald-500/30 hover:text-white rounded-lg flex items-center justify-center gap-1 transition-all"
                                    >
                                        <Check size={14} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(req._id, "reject")}
                                        className="flex-1 text-xs py-2 bg-red-600/20 text-red-400 hover:bg-red-600 border border-red-500/30 hover:text-white rounded-lg flex items-center justify-center gap-1 transition-all"
                                    >
                                        <X size={14} /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
