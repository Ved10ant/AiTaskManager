import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import TaskPage from "./pages/TasksPage"
import { useAuth } from "./features/auth/hooks/useAuth"
import ProtectedRoute from "./components/shared/ProtectedRoutes"
import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

function AppRoutes() {
  const { refreshProfile, logout } = useAuth();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshProfile().catch(() => {
        logout();
      });
    }
  }, [refreshProfile, logout]);
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TaskPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NavigateToFallback />} />
    </Routes>
  )
}
function NavigateToFallback() {
  const token = localStorage.getItem("token");
  return <>{token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}