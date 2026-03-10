import { useUserStore } from "../../store/useUserStore"
import { Navigate } from "react-router-dom";
import React from "react";

type Props = {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
    const token = useUserStore((s) => s.token) ?? localStorage.getItem('token')
    if (!token) {
        return <Navigate to='/login' replace />
    }
    return <>
        {children}
    </>
}