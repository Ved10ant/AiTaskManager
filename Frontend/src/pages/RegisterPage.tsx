import { Link } from "react-router-dom";
import RegisterForm from "../features/auth/components/RegisterForm";

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-center mb-8">
                    Create Account
                </h2>
                
                <RegisterForm />

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
