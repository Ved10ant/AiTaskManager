import { useState } from "react";
import { registerUser } from "../services/authService";
import { useUserStore } from "../../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Code, Cpu, Terminal, Palette, Database, Layers } from "lucide-react";

const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const setAuth = useUserStore((state) => state.setAuth);
    const navigate = useNavigate();

    const SKILL_OPTIONS = [
        { id: "mern", label: "MERN Stack", icon: <Layers size={14} /> },
        { id: "frontend", label: "Frontend", icon: <Palette size={14} /> },
        { id: "backend", label: "Backend", icon: <Terminal size={14} /> },
        { id: "python", label: "Python", icon: <Cpu size={14} /> },
        { id: "java", label: "Java", icon: <Terminal size={14} /> },
        { id: "flutter", label: "Flutter", icon: <Layers size={14} /> },
        { id: "mongo", label: "MongoDB", icon: <Database size={14} /> },
        { id: "react", label: "React", icon: <Code size={14} /> },
    ];

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev => 
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await registerUser({ 
                name, 
                email, 
                password, 
                role,
                skills: selectedSkills 
            });
            setAuth(res.user, res.token);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Registration failed. Email might already be taken.");
        }
    };

    return (
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                    <label className="text-gray-400 text-xs uppercase font-bold ml-1 tracking-wider">Full Name</label>
                    <input
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                        required
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-gray-400 text-xs uppercase font-bold ml-1 tracking-wider">Email Address</label>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                        required
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs uppercase font-bold ml-1 tracking-wider">Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                    required
                />
            </div>
            
            {/* Role & Skills Selection (Skills only for employees) */}
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-1">
                    <label className="text-gray-400 text-xs uppercase font-bold ml-1 tracking-wider">Account Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="bg-[#1e1b4b] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    >
                        <option value="employee">Employee / Developer</option>
                        <option value="admin">Administrator (Restricted)</option>
                    </select>
                </div>

                <AnimatePresence>
                    {role === 'employee' && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 overflow-hidden"
                        >
                            <label className="text-cyan-400 text-[10px] uppercase font-black mb-3 block flex items-center gap-1.5">
                                <Sparkles size={12} /> Tech Stack & Skills Checklist
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {SKILL_OPTIONS.map((skill) => (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => toggleSkill(skill.label)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                                            selectedSkills.includes(skill.label)
                                                ? "bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                                                : "bg-black/20 border-white/5 text-gray-500 hover:border-white/20"
                                        }`}
                                    >
                                        <span className={selectedSkills.includes(skill.label) ? "text-purple-400" : "text-gray-600"}>
                                            {skill.icon}
                                        </span>
                                        {skill.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-3 italic">* AI uses these skills for automated task allocation and scoring.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button 
                type="submit" 
                className="mt-2 relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-purple-500/20"
            >
                Confirm Intelligence Onboarding
            </button>
        </form>
    );
};

export default RegisterForm;
