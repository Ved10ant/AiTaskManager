import { useState } from "react";
import { PlusCircle, Sparkles } from "lucide-react";

interface TaskFormProps {
    onSubmit: (payload: any) => Promise<void>;
    creating: boolean;
}

export const TaskForm = ({ onSubmit, creating }: TaskFormProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requiredSkills, setRequiredSkills] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setPriority] = useState("medium");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            title,
            description,
            requiredSkills: requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
            deadline,
            priority,
        };
        await onSubmit(payload);
        setTitle("");
        setDescription("");
        setRequiredSkills("");
        setDeadline("");
        setPriority("medium");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <PlusCircle className="text-cyan-400" /> New Task
            </h2>
            <div className="grid grid-cols-1 gap-4">
                <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title (e.g. Build API)"
                    className="w-full bg-black/30 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500"
                />
                <input
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    type="date"
                    className="w-full bg-black/30 border border-white/10 text-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
            </div>
            
            <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description..."
                rows={3}
                className="w-full bg-black/30 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500"
            />
            
            <div className="grid grid-cols-1 gap-4">
                <input
                    required
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    placeholder="Required skills (e.g. React, Node)"
                    className="w-full bg-black/30 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500"
                />
                <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)} 
                    className="w-full bg-black/30 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    style={{ backgroundColor: "#1e1b4b" }}
                >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>
            </div>

            <div className="pt-2 flex justify-end">
                <button 
                    type="submit" 
                    disabled={creating} 
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    {creating ? "Processing..." : <><Sparkles size={18} /> Allocate Candidate</>}
                </button>
            </div>
        </form>
    );
};
