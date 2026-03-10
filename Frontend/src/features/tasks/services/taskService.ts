import axiosinstance from "../../../api/axiosInstance";
import { endPoints } from "../../../api/endpoints";

export const fetchTasks = async () => {
    const res = await axiosinstance.get(endPoints.tasks)
    return res.data;
}

export const createTask = async (payload: any) => {
    const res = await axiosinstance.post(endPoints.tasks , payload)
    return res.data
}

export const updateTask = async (id: string, payload: any) => {
    const res = await axiosinstance.patch(`${endPoints.tasks}/${id}`, payload)
    return res.data
}

export const deleteTask = async (id: string) => {
    const res = await axiosinstance.delete(`${endPoints.tasks}/${id}`)
    return res.data
}