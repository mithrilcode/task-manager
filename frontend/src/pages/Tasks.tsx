import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask } from "../api/tasks";
import type { Task, TaskCreate } from "../api/tasks";

const Tasks = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskCreate["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);


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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title || !dueDate) {
      setFormError("Title and due date are required");
      return;
    }

    try {
      setSubmitting(true);

      const newTask = await createTask({
        title,
        priority,
        due_date: dueDate,
        description: description || undefined,
      });

      setTasks((prev) => [newTask, ...prev]);

      // reset form
      setTitle("");
      setPriority("medium");
      setDueDate("");
      setDescription("");
    } catch {
      setFormError("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

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

      <form
        onSubmit={handleCreateTask}
        className="mb-6 p-4 border rounded space-y-4"
      >
        <h2 className="font-semibold">Create Task</h2>

        {formError && (
          <p className="text-red-500 text-sm">{formError}</p>
        )}

        <div>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as TaskCreate["priority"])
            }
            className="p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div>
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Task"}
        </button>
      </form>

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
