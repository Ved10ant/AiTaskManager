import { useState } from "react";
import { assignTask } from "../services/allocationService";
import toast from "react-hot-toast";

type Candidate = {
    id: number;
    _id: number;
    name: string;
    skills?: string[]
}

type AllocationResult = {
    candidate: Candidate;
    score: number;
    reason?: string;
};

type Props = {
    data: AllocationResult;
    taskId: string;
    onClose: () => void;
    onAssigned?: (updatedTask?: any) => void;
};

const BestCandidateModal: React.FC<Props> = ({ data, taskId, onClose, onAssigned }) => {
    const [assigned, setAssigned] = useState(false)

    const candidateId = data.candidate?.id || data.candidate?._id
    const handleAssign = async () => {
        if (!candidateId || !taskId) {
            console.error("Missing candidate or task id")
            return
        }
        try {
            setAssigned(true)
            const res = await assignTask(taskId, candidateId.toString())
            if (onAssigned) {
                onAssigned(res)
            }
            toast.success("Task assigned successfully")
            onClose()
        } catch (error) {
            console.error("Failed to assign task", error)
            toast.error("Failed to assign task")
        } finally {
            setAssigned(false)
        }
    }


    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Best Candidate</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-700">
                            <span className="font-semibold">Candidate:</span>{" "}
                            {data.candidate?.name}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">Score:</span>{" "}
                            {data.score}
                        </p>
                        {data.reason && (
                            <p className="text-gray-700 mt-2">
                                <span className="font-semibold">Reason:</span>{" "}
                                {data.reason}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAssign}
                            disabled={assigned}
                            className={`px-4 py-2 text-white rounded-md ${assigned
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {assigned ? "Assigning..." : "Assign Task"}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default BestCandidateModal