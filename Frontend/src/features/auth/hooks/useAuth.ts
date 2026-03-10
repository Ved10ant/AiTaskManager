import { useCallback } from "react";
import { loginUser, getProfile, registerUser } from "../services/authService";
import { useUserStore } from "../../../store/useUserStore";

export const useAuth = () => {
    const setAuth = useUserStore((s) => s.setAuth);
    const logoutStore = useUserStore((s) => s.logout);
    const setUser = useUserStore((s) => s.setUser);

    const login = useCallback(async (email: string, password: string) => {
        const data = await loginUser({ email, password });
        setAuth(data.user, data.token);
        return data;
    }, [setAuth]);

    const register = useCallback(async (payload: any) => {
        const data = await registerUser(payload);
        setAuth(data.user, data.token);
        return data;
    }, [setAuth]);

    const logout = useCallback(() => {
        logoutStore();
    }, [logoutStore]);

    const refreshProfile = useCallback(async () => {
        try {
            const profile = await getProfile();
            setUser(profile);
            return profile;
        } catch (err) {
            throw err;
        }
    }, [setUser]);

    const isAuthenticated = () => {
        return !!localStorage.getItem("token");
    };

    return {
        login,
        register,
        logout,
        isAuthenticated,
        refreshProfile,
    };
};