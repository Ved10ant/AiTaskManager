import React from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Award, Star, Mail, Shield, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MemberProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: any;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ isOpen, onClose, member }) => {
    if (!member) return null;

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
                        className="relative w-full max-w-xl bg-gray-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="relative p-6 border-b border-white/5 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-cyan-500/20">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{member.name}</h2>
                                        <p className="text-xs text-cyan-400 font-medium">Employee Profile & Resume</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1">
                                        <Mail size={12} /> Contact Email
                                    </p>
                                    <p className="text-sm text-white font-medium truncate">{member.email}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1">
                                        <Shield size={12} /> Access Role
                                    </p>
                                    <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20 uppercase">
                                        {member.role}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
                                    <Award size={12} /> Professional Skills
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {member.skills && member.skills.length > 0 ? (
                                        member.skills.map((skill: string) => (
                                            <span key={skill} className="px-3 py-1.5 bg-white/5 text-xs text-gray-300 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-colors">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-600 italic text-xs">No skills listed</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                                    <Star className="mx-auto mb-1 text-amber-400" size={16} fill="currentColor" />
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Chances</p>
                                    <p className="text-sm text-emerald-400 font-bold">{member.performanceScore || 50}%</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                                    <Briefcase className="mx-auto mb-1 text-purple-400" size={16} />
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Tasks</p>
                                    <p className="text-sm text-white font-bold">{member.currentWorkload || 0}</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                                    <Calendar className="mx-auto mb-1 text-emerald-400" size={16} />
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Joined Date</p>
                                    <p className="text-[11px] text-white font-bold">{new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Resume Abstract</p>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Dedicated {member.role} with {member.experienceYears || 0} years of industry experience.
                                    Successfully managed {member.currentWorkload || 0} active modules with a consistent {member.performanceScore || 50}% efficiency rating.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 flex gap-3">
                            <button onClick={onClose} className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all text-sm">
                                Close Profile
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
