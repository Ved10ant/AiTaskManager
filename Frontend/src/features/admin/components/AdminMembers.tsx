import React, { useEffect, useState } from "react";
import { fetchMembers } from "../services/adminService";
import { Users, Briefcase } from "lucide-react";

export const AdminMembers = () => {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers()
            .then(data => setMembers(data))
            .catch(err => console.error("Failed to fetch members", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="animate-pulse text-gray-400">Loading members...</div>;

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Users className="text-cyan-400" />
                Company Members
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-black/20 text-gray-400">
                        <tr>
                            <th className="p-3 rounded-tl-lg">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3 rounded-tr-lg">Workload</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {members.map(member => (
                            <tr key={member._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 font-medium text-white">{member.name}</td>
                                <td className="p-3">{member.email}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${member.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                        {member.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Briefcase size={14} className={member.currentWorkload > 3 ? "text-amber-400" : "text-emerald-400"} />
                                        {member.currentWorkload || 0} tasks
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
