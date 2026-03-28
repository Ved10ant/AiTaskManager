import { useState, useEffect, useCallback } from "react";
import * as taskservices from "../services/taskService"

export const useTasks = () => {
    const [tasks, setTasks] = useState<any[]>([])
    const [error, setError] = useState<any>()
    const [loading, setLoading] = useState<any>(false)

    const loadData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const taskData = await taskservices.fetchTasks()
            setTasks(taskData)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    const createTask = async (payload: any) => {
        setLoading(true)
        try {
            const createdTask = await taskservices.createTask(payload)
            await loadData()
            setTasks((prev) => [...prev, createdTask])
            return createdTask
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const updateTask = async (id: string, payload: any) => {
        await taskservices.updateTask(id, payload)
        await loadData()
    }

    const deletTask = async (id: string) => {
        await taskservices.deleteTask(id)
        await loadData()
    }

    return {
        tasks,
        error,
        loading,
        loadData,
        createTask,
        updateTask,
        deletTask
    }
}