import { useState } from "react";
import { assignTask } from "../services/allocationService";
import toast from "react-hot-toast";
import ScoreMeter from "./ScoreMeter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, BrainCircuit, UserCheck, ShieldCheck, Cpu } from "lucide-react";

type Candidate = {
    id: string;
    _id: string;
    name: string;
    skills?: string[];
}

type AIInsights = {
    requiredSkills: string[];
    difficulty: string;
    estimatedHours: number;
};

type AllocationResult = {
    candidate: Candidate;
    score: number; // 0 to 1
    reason?: string;
    aiInsights?: AIInsights;
};

type Props = {
    data: AllocationResult;
    taskId: string;
    onClose: () => void;
    onAssigned?: (updatedTask?: any) => void;
};

const BestCandidateModal: React.FC<Props> = ({ data, taskId, onClose, onAssigned }) => {
    const [assigned, setAssigned] = useState(false);

    const candidateId = data.candidate?._id || (data.candidate as any)?.id;
    
    const handleAssign = async () => {
        if (!candidateId || !taskId) {
            toast.error("Missing candidate or task identification");
            return;
        }
        try {
            setAssigned(true);
            const res = await assignTask(taskId, candidateId.toString());
            if (onAssigned) {
                onAssigned(res);
            }
            toast.success("Assignment Confirmed! Employee notified.");
            onClose();
        } catch (error) {
            console.error("Failed to assign task", error);
            toast.error("Failed to finalize assignment");
        } finally {
            setAssigned(false);
        }
    };

    const displayScore = Math.round(data.score * 100);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-gray-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header with Background Glow */}
                    <div className="relative p-6 border-b border-white/5 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10">
                        <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm" />
                        
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/20">
                                    <BrainCircuit className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">AI Allocation Engine</h2>
                                    <p className="text-xs text-cyan-400 font-medium">Matching Optimized for Performance</p>
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

                    <div className="p-6 space-y-6">
                        {/* Candidate Card */}
                        <div className="group relative bg-white/5 border border-white/5 rounded-2xl p-5 transition-all hover:border-white/10">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-xl">
                                    {data.candidate?.name?.[0].toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-white mb-0.5">{data.candidate?.name}</h3>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1">
                                            <ShieldCheck size={12} /> verified Match
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {data.candidate?.skills?.slice(0, 3).map(skill => (
                                            <span key={skill} className="px-2 py-0.5 bg-white/5 text-[10px] text-gray-400 rounded-md border border-white/5 uppercase font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <ScoreMeter score={displayScore} />
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col justify-center">
                                <span className="text-[10px] uppercase text-gray-500 font-bold mb-1">AI Insights</span>
                                <div className="flex items-center gap-2 text-white font-medium mb-1">
                                    <Cpu size={14} className="text-purple-400" />
                                    <span className="text-sm capitalize">{data.aiInsights?.difficulty || 'Medium'} Difficulty</span>
                                </div>
                                <div className="flex items-center gap-2 text-white font-medium">
                                    <Sparkles size={14} className="text-cyan-400" />
                                    <span className="text-sm">Est. {data.aiInsights?.estimatedHours || 4} Hours</span>
                                </div>
                            </div>
                        </div>

                        {/* Recognition Note */}
                        {data.reason && (
                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                                    <UserCheck size={14} /> Allocation Strategy
                                </div>
                                <p className="text-sm text-gray-300 italic leading-relaxed">
                                    "{data.reason}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 pt-2 bg-gray-900/50 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-sm font-bold text-gray-400 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-all active:scale-95"
                        >
                            Decline
                        </button>
                        <button
                            onClick={handleAssign}
                            disabled={assigned}
                            className="flex-[2] relative overflow-hidden px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {assigned ? "Finalizing..." : <><ShieldCheck size={18} /> Confirm Allocation</>}
                            </span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BestCandidateModal;