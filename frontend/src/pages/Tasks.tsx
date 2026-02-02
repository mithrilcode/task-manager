import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { getTasks } from "../api/tasks";
import type { Task } from "../api/tasks";

import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";

const Tasks = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  /* =========================
     Task List State
  ========================= */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     Auth
  ========================= */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* =========================
     Load Tasks
  ========================= */
  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  /* =========================
     Helpers
  ========================= */
  const applyTaskUpdate = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );
  };

  const removeTaskFromState = (taskId: string) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== taskId)
    );
  };

  const addTaskToState = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Tasks
        </h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white"
        >
          Logout
        </button>
      </div>

      {/* Create Task */}
      <TaskForm onCreate={addTaskToState} />

      {/* States */}
      {loading && (
        <p className="text-gray-400">
          Loading tasks…
        </p>
      )}

      {error && (
        <p className="text-red-400">{error}</p>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p className="text-gray-400">
          No tasks yet.
        </p>
      )}

      {/* Task List */}
      {!loading && !error && tasks.length > 0 && (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={applyTaskUpdate}
              onDelete={removeTaskFromState}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tasks;
