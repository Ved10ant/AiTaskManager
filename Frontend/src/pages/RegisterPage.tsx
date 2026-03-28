import { useState } from "react";
import { registerUser } from "../features/auth/services/authService";
import { useUserStore } from "../store/useUserStore";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-center mb-8">
                    Create Account
                </h2>
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
                        <label className="text-gray-300 text-sm ml-1">Account Type</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="bg-purple-900/50 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        >
                            <option value="employee" className="bg-purple-900">Employee</option>
                            <option value="admin" className="bg-purple-900">Admin</option>
                        </select>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                    >
                        Register
                    </button>
                </form>
                <p className="text-gray-400 text-center mt-6 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors underline-offset-4 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
