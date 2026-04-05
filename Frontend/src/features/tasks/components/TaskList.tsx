import { Clock, Tag, AlertCircle, CheckCircle2, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";
import { MemberProfileModal } from "../../admin/components/MemberProfileModal";
import { useUserStore } from "../../../store/useUserStore";
import { requestTaskClaim } from "../../admin/services/adminService";
import toast from "react-hot-toast";

interface TaskListProps {
    tasks: any[];
    loading: boolean;
    error: any;
    onRecommend?: (taskId: string) => void;
}

export const TaskList = ({ tasks, loading, error, onRecommend }: TaskListProps) => {
    const user = useUserStore((state) => state.user);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [showProfile, setShowProfile] = useState(false);
    
    if (loading) return <div className="text-gray-400 p-4 border border-white/10 bg-white/5 rounded-2xl animate-pulse">Loading tasks...</div>;
    if (error) return <div className="text-red-400 p-4 border border-red-500/30 bg-red-500/10 rounded-2xl">Failed to load tasks.</div>;

    // Filter tasks: Admins see all, employees see unassigned or their own
    const visibleTasks = user?.role === 'admin' 
        ? tasks 
        : tasks.filter(t => !t.assignedTo || t.assignedTo._id === user?.id || t.assignedTo.id === user?.id);

    if (visibleTasks.length === 0) return <div className="text-gray-400 p-4 border border-white/10 bg-white/5 rounded-2xl text-center">No tasks available matching your criteria.</div>;

    const getPriorityColor = (priority: string) => {
        switch(priority.toLowerCase()) {
            case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    }

    const handleRequest = async (taskId: string) => {
        try {
            await requestTaskClaim(taskId);
            toast.success("Task request submitted to admin!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit request.");
        }
    }

    return (
        <div className="grid grid-cols-1 gap-4 mt-4">
            {visibleTasks.map((task: any) => (
                <div key={task._id} className="p-5 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-white">{task.title}</h3>
                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(task.priority)}`}>
                                {task.priority.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{(task.description || "").substring(0, 100)}{task.description?.length > 100 ? '...' : ''}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                            {task.requiredSkills?.map((skill: string, idx: number) => (
                                <span key={idx} className="flex items-center gap-1 text-xs text-cyan-300 bg-cyan-900/30 px-2 py-1 rounded-md">
                                    <Tag size={12} /> {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2 text-sm text-gray-400 min-w-[150px]">
                        <span className="flex items-center gap-1"><Clock size={14} className="text-purple-400"/> Due: {new Date(task.deadline).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                            {task.status === 'completed' ? <CheckCircle2 size={14} className="text-emerald-400"/> : <AlertCircle size={14} className="text-amber-400"/>} 
                            Status: <span className="text-white capitalize">{task.status || 'pending'}</span>
                        </span>
                        
                        {task.assignedTo ? (
                            <div className="mt-1 flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                                    {task.assignedTo.name?.charAt(0)}
                                </div>
                                <span className="text-gray-300 font-medium text-xs truncate max-w-[100px]">{task.assignedTo.name}</span>
                                {user?.role === 'admin' && (
                                    <button 
                                        onClick={() => { setSelectedMember(task.assignedTo); setShowProfile(true); }}
                                        className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-cyan-400"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            user?.role === 'employee' ? (
                                <button 
                                    onClick={() => handleRequest(task._id)}
                                    className="mt-2 text-xs flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg transition-colors border border-indigo-500/50 shadow-lg shadow-indigo-500/20 font-bold"
                                >
                                    <CheckCircle2 size={14} /> Request Claim
                                </button>
                            ) : (
                                <div className="flex flex-col gap-2 mt-2">
                                    <span className="text-xs text-gray-500 italic">Unassigned</span>
                                    {user?.role === 'admin' && onRecommend && (
                                        <button 
                                            onClick={() => onRecommend(task._id)}
                                            className="text-[10px] flex items-center gap-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 px-3 py-1.5 rounded-lg transition-all border border-cyan-500/30 font-bold uppercase tracking-wider"
                                        >
                                            <Sparkles size={12} /> Recommended
                                        </button>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            ))}

            <MemberProfileModal 
                isOpen={showProfile} 
                onClose={() => setShowProfile(false)} 
                member={selectedMember} 
            />
        </div>
    );
};
