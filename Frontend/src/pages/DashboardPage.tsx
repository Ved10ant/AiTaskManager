import React from 'react'
import { useUserStore } from '../store/useUserStore'
import { useNavigate, Link } from 'react-router-dom'

const DashboardPage = () => {
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            {user ? (
                <div>
                    <p>Welcome, <strong>{user.name}</strong> ({user.role})</p>
                    <nav style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <Link to="/tasks">View Tasks</Link>
                        <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
                    </nav>
                    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                        <h3>Statistics Overview</h3>
                        <p>This is your personalized dashboard. You can manage tasks and view analytics here.</p>
                    </div>
                </div>
            ) : (
                <p>Loading user profile...</p>
            )}
        </div>
    )
}

export default DashboardPage