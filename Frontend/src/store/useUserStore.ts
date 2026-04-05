import { create } from 'zustand'

export interface User {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    role: string;
    skills?: string[];
}

interface UserStore {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const initialUserJson = typeof window !== "undefined" ? localStorage.getItem("user") : null;

export const useUserStore = create<UserStore>((set) => ({
    user: initialUserJson ? JSON.parse(initialUserJson) : null,
    token: initialToken,
    setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token });
    },
    setUser: (user) => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
        set({ user });
    },
    setToken: (token) => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
        set({ token });
    },
    logout: () => {
        localStorage.removeItem('token'),
            localStorage.removeItem('user')
        set({ user: null, token: null })
    }
}))