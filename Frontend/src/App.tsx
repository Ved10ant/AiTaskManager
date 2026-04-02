import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import TaskPage from "./pages/TasksPage"
import { useAuth } from "./features/auth/hooks/useAuth"
import ProtectedRoute from "./components/shared/ProtectedRoutes"
import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import RegisterPage from "./pages/RegisterPage";
import { Navbar } from "./components/layout/Navbar"
import RequestPage from "./pages/RequestPage"
import AllocatedTask from "./pages/AllocatedTask"
import Setting from "./pages/Setting"
import DynamicBackground from "./components/layout/DynamicBackground"

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
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navbar />
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Navbar />
            <TaskPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Navbar />
            <RequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/allocate"
        element={
          <ProtectedRoute>
            <Navbar />
            <AllocatedTask />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Navbar />
            <Setting />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NavigateToFallback />} />

    </Routes>
  )
}
function NavigateToFallback() {
  const token = localStorage.getItem("token");
  return <>{token ? <Navigate to="/dashboard" /> : <Navigate to="/register" />}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <DynamicBackground />
      <AppRoutes />
    </BrowserRouter>
  );
}