import { useState } from "react";
import { registerUser } from "../services/authService";
import { useUserStore } from "../../../store/useUserStore";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");
    const setAuth = useUserStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await registerUser({ name, email, password, role });
            setAuth(res.user, res.token);
            navigate("/dashboard");
        } catch (err) {
            alert("Registration failed. Email might already be taken.");
        }
    };

    return (
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="flex flex-col space-y-1">
                <label className="text-gray-300 text-sm ml-1">Full Name</label>
                <input
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                    required
                />
            </div>
            <div className="flex flex-col space-y-1">
                <label className="text-gray-300 text-sm ml-1">Email Address</label>
                <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                    required
                />
            </div>
            <div className="flex flex-col space-y-1">
                <label className="text-gray-300 text-sm ml-1">Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                    required
                />
            </div>
            
            <div className="flex flex-col space-y-1">
                <label className="text-gray-300 text-sm ml-1">Account Type (Regulated)</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-[#1e1b4b] border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                </select>
                <span className="text-xs text-cyan-400/70 ml-1 mt-1">* Admin role enforces database verification</span>
            </div>

            <button 
                type="submit" 
                className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
            >
                Register
            </button>
        </form>
    );
};

export default RegisterForm;
