export const endPoints = {
    login: "/auth/login",
    register: "/auth/register",
    tasks: "/tasks",
    assignedTask: "/tasks/assigned", // Updated from /allocatedTask to something more sensible
    dashboardStates: "/admin/dashboard", // Updated from /admin/states to match adminRoutes.js
    bestCandidate: "/tasks/assigned/best-candidate", // Updated from /allocatedTask to something more sensible
    profile: '/auth/profile' // Profiles usually live under auth or their own prefix
}