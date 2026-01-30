import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks } from "../api/tasks";
import type { Task } from "../api/tasks";

const Tasks = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white"
        >
          Logout
        </button>
      </div>

      {loading && (
        <p className="text-gray-400">Loading tasks…</p>
      )}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p className="text-gray-400">No tasks yet.</p>
      )}

      {!loading && !error && tasks.length > 0 && (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="border rounded p-3 flex flex-col gap-1"
            >
              <div className="font-medium">{task.title}</div>

              <div className="text-sm text-gray-500">
                Priority: {task.priority} · Status: {task.status}
              </div>

              <div className="text-sm text-gray-400">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </div>

              {task.description && (
                <div className="text-sm">{task.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tasks;
