import { Link } from "react-router-dom";
import LoginForm from "../features/auth/components/LoginForm";

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-center mb-8">
                    Welcome Back
                </h2>
                
                <LoginForm />

                <p className="text-gray-400 text-center mt-6 text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors underline-offset-4 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;