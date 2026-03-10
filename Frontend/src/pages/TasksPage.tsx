import React, { useState } from "react";
import { useTasks } from "../features/tasks/hooks/useTasks";
const TaskPage: React.FC = () => {
    const { tasks, loading, error, createTask } = useTasks();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requiredSkills, setRequiredSkills] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setPriority] = useState("medium");
    const [creating, setCreating] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)
        try {
            const payload = {
                title,
                description,
                requiredSkills: requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
                deadline,
                priority,
                creating
            }
            await createTask(payload)
            setTitle("")
            setDescription("")
            setRequiredSkills("")
            setDeadline("")
            setPriority("medium")
            setCreating(false)
        } catch (error) {
            console.error("Error creating task", error)
        } finally {
            setCreating(false)
        }
    }
    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Tasks</h1>
            <section className="mb-6">
                <h2 className="font-semibold mb-2">Create Task</h2>
                <form onSubmit={handleCreate} className="space-y-2 max-w-lg">
                    <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full p-2 border rounded"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        value={requiredSkills}
                        onChange={(e) => setRequiredSkills(e.target.value)}
                        placeholder="Required skills (comma separated)"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        type="date"
                        className="p-2 border rounded"
                    />
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="p-2 border rounded">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <button disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded">
                        {creating ? "Creating..." : "Create Task"}
                    </button>
                </form>
            </section>

            <section>
                <h2 className="font-semibold mb-2">Task List</h2>

                {loading && <p>Loading tasks...</p>}
                {error && <p className="text-red-500">Failed to load tasks</p>}
                {!loading && tasks.length === 0 && <p>No tasks yet</p>}

                <div className="space-y-3 mt-4">
                    {tasks.map((task: any) => (
                        <div key={task._id} className="p-3 border rounded">
                            <h3 className="font-semibold">{task.title}</h3>
                            <p>{task.description}</p>
                            <p className="text-sm text-gray-500">Skills: {(task.requiredSkills || []).join(", ")}</p>
                            <p className="text-sm text-gray-500">Priority: {task.priority}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div >
    )
}

export default TaskPage