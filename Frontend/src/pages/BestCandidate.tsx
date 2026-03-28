import toast from "react-hot-toast";
import { assignTask } from "../features/allocation/services/allocationService";
import { useState } from "react";

type Candidate = {
    id: string,
    _id: string,
    skills?: string[],
    name: string,
}
type AllocateTask = {
    candidate: Candidate,
    score?: number,
    reason?: string
}
type Props = {
    data: AllocateTask,
    taskId: string,
    onClose: () => void,
    onAssigned?: (updatedTask?: any) => void;
}

const BestCandidate: React.FC<Props> = ({ data, taskId, onClose, onAssigned }) => {
    const [assigning, setAssigning] = useState(false)

    const handleAssign = async () => {
        setAssigning(true)
        try {
            const result = await assignTask(taskId, data.candidate._id)
            if (onAssigned) {
                onAssigned(result)
            }
            onClose()
        } catch (error) {
            console.error("Error assigning task", error)
        } finally {
            setAssigning(false)
        }
        try {
            setAssigning(true);
            const res = await assignTask(taskId, data.candidate._id);
            if (onAssigned) onAssigned(res);
            toast.success("Task assigned successfully");
            onClose();
        } catch (err: any) {
            console.error("Assign failed", err);
            const message = err?.response?.data?.message ?? "Failed to assign task";
            toast.error(message);
        } finally {
            setAssigning(false);
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Best Candidate</h1>
            <section className="mb-6">
                <h2 className="font-semibold mb-2">Candidate Details</h2>
                <p>Name: {data.candidate.name}</p>
                <p>Skills: {data.candidate.skills?.join(", ")}</p>
                <p>Score: {data.score}</p>
                <p>Reason: {data.reason}</p>
            </section>
            <section>
                <button onClick={handleAssign} disabled={assigning} className="px-4 py-2 bg-blue-600 text-white rounded">
                    {assigning ? "Assigning..." : "Assign Task"}
                </button>
            </section>
        </div>
    )
}

export default BestCandidate
