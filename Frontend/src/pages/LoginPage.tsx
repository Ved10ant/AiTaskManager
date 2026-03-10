import { useState } from "react";
import { loginUser  } from "../features/auth/services/authService";
import { useUserStore } from "../store/useUserStore";

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const setUser = useUserStore((state) => state.setUser);

    const handleLogin = async () => {

        const res = await loginUser({ email, password });

        setUser(res.user, res.token);

    };

    return (
        <div>
            <h2>Login</h2>

            <input
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>

        </div>
    );
};

export default LoginPage;