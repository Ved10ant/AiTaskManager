import axiosInstance from "../../../api/axiosInstance";
import axiosinstance from "../../../api/axiosInstance";
import { endPoints } from "../../../api/endpoints";
import type { User } from "../../../store/useUserStore";

export interface LoginPayload {
    email: string,
    password: string
}
export interface RegisterPayload {
    name: string,
    email: string,
    password: string,
    role?: string
}

export interface AuthResponse {
    user: User,
    token: string
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await axiosinstance.post(endPoints.login, payload)
    return res.data
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await axiosinstance.post(endPoints.register, payload)
    return res.data
}

export const getProfile = async (): Promise<any> => {
    const res = await axiosInstance.get(endPoints.profile);
    return res.data;
};