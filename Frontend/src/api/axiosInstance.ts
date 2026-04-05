import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const axiosinstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

axiosinstance.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
    } catch (err) {
        console.error(err)
    }
    return config;
})

axiosinstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } catch (err) {
                console.error(err)
            }
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);


export default axiosinstance