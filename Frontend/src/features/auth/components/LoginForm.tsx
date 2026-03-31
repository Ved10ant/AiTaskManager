import { useState } from "react";
import { loginUser } from "../services/authService";
import { useUserStore } from "../../../store/useUserStore";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setAuth = useUserStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await loginUser({ email, password });
            setAuth(res.user, res.token);
            navigate("/dashboard");
        } catch (err) {
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
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
            
            <button 
                type="submit" 
                className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
            >
                Login
            </button>
        </form>
    );
};

export default LoginForm;
