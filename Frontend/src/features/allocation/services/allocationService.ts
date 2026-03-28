import axiosinstance from "../../../api/axiosInstance";
import { endPoints } from "../../../api/endpoints";

export const allocateTask = async (taskId: string) => {
    const res = await axiosinstance.post(endPoints.assignedTask, { taskId })
    console.log(res.data)
    return res.data
}

export const assignTask = async (taskid: string, candidateId: string) => {
    const res = endPoints.assignedTask ? await axiosinstance.post(endPoints.assignedTask, { taskid, candidateId }) : null
    return res?.data
}

export const getBestCandidate = async (taskId: string) => {
    const res = await axiosinstance.get(`${endPoints.bestCandidate}/${taskId}`)
    return res.data
}