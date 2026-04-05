import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUserStore } from "../store/useUserStore";
import toast from "react-hot-toast";

interface Notification {
    id: string;
    message: string;
    type: string;
    timestamp: Date;
    read: boolean;
}

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    notifications: Notification[];
    unreadCount: number;
    clearNotifications: () => void;
    markAsRead: (id: string) => void;
}

const SocketContext = createContext<SocketContextType>({ 
    socket: null, 
    isConnected: false, 
    notifications: [], 
    unreadCount: 0,
    clearNotifications: () => {},
    markAsRead: () => {}
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useUserStore((state) => state.user);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const clearNotifications = () => setNotifications([]);
    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    useEffect(() => {
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5001";
        const newSocket = io(socketUrl, {
            transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            setIsConnected(true);
        });

        newSocket.on("notification", (data: any) => {
            console.log("Notification received:", data);
            
            if (data.userId === user.id || data.userId === user._id) {
                const newNotification: Notification = {
                    id: Math.random().toString(36).substr(2, 9),
                    message: data.message,
                    type: data.type || "general",
                    timestamp: new Date(),
                    read: false
                };

                setNotifications(prev => [newNotification, ...prev]);

                toast.success(data.message, {
                    duration: 6000,
                    icon: '🚀',
                    style: {
                        borderRadius: '12px',
                        background: '#0f172a',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)'
                    },
                });
            }
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user?.id, user?._id]);

    return (
        <SocketContext.Provider value={{ 
            socket, 
            isConnected, 
            notifications, 
            unreadCount, 
            clearNotifications, 
            markAsRead 
        }}>
            {children}
        </SocketContext.Provider>
    );
};
