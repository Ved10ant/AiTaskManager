import axiosInstance from "../../../api/axiosInstance";
import { endPoints } from "../../../api/endpoints";

export const requestTaskClaim = async (taskId: string) => {
    const res = await axiosInstance.post(`${endPoints.tasks}/${taskId}/request`);
    return res.data;
};

export const fetchMembers = async () => {
    const res = await axiosInstance.get(endPoints.members);
    return res.data;
};

export const fetchTaskRequests = async () => {
    const res = await axiosInstance.get(endPoints.adminRequests);
    return res.data;
};

export const updateTaskRequestStatus = async (requestId: string, action: "approve" | "reject") => {
    const res = await axiosInstance.patch(`${endPoints.adminRequests}/${requestId}`, { action });
    return res.data;
};
