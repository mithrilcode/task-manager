import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getTasks,
  createTask,
  updateTask,
} from "../api/tasks";

import type {
  Task,
  TaskCreate,
  TaskUpdate,
} from "../api/tasks";

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
     Create Task Form State
  ========================= */
  const [title, setTitle] = useState("");
  const [priority, setPriority] =
    useState<TaskCreate["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  /* =========================
     Create Task
  ========================= */
  const handleCreateTask = async (
    e: React.FormEvent
  ) => {
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
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white"
        >
          Logout
        </button>
      </div>

      {/* Create Task Form */}
      <form
        onSubmit={handleCreateTask}
        className="mb-8 p-6 border border-white/20 rounded space-y-4"
      >
        <h2 className="font-semibold text-lg">Create Task</h2>

        {formError && (
          <p className="text-red-400 text-sm">{formError}</p>
        )}

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-white text-gray-900 placeholder-gray-400"
        />

        <div className="flex gap-4">
          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value as TaskCreate["priority"]
              )
            }
            className="p-2 rounded bg-white text-gray-900"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 rounded bg-white text-gray-900"
          />
        </div>

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full p-2 rounded bg-white text-gray-900 placeholder-gray-400"
        />

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Task"}
        </button>
      </form>

      {/* States */}
      {loading && (
        <p className="text-gray-400">Loading tasks…</p>
      )}

      {error && (
        <p className="text-red-400">{error}</p>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p className="text-gray-400">No tasks yet.</p>
      )}

      {/* Task List */}
      {!loading && !error && tasks.length > 0 && (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="border border-white/20 rounded p-4 space-y-2"
            >
              <div className="flex justify-between gap-2">
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === task.id
                          ? { ...t, title: value }
                          : t
                      )
                    );
                  }}
                  onBlur={async (e) => {
                    try {
                      const updated = await updateTask(
                        task.id,
                        { title: e.target.value }
                      );
                      applyTaskUpdate(updated);
                    } catch {
                      alert("Failed to update title");
                    }
                  }}
                  className="bg-transparent border-b border-white/30 focus:outline-none flex-1 text-white"
                />

                <button
                  onClick={async () => {
                    try {
                      const updated = await updateTask(
                        task.id,
                        {
                          status:
                            task.status === "done"
                              ? "todo"
                              : "done",
                        }
                      );
                      applyTaskUpdate(updated);
                    } catch {
                      alert("Failed to update status");
                    }
                  }}
                  className="text-sm text-indigo-400 hover:underline"
                >
                  {task.status === "done"
                    ? "Mark Todo"
                    : "Mark Done"}
                </button>
              </div>

              <div className="flex gap-4 items-center">
                <select
                  value={task.priority}
                  onChange={async (e) => {
                    try {
                      const updated = await updateTask(
                        task.id,
                        {
                          priority:
                            e.target.value as TaskUpdate["priority"],
                        }
                      );
                      applyTaskUpdate(updated);
                    } catch {
                      alert("Failed to update priority");
                    }
                  }}
                  className="p-1 rounded bg-white text-gray-900 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <input
                  type="date"
                  value={task.due_date.slice(0, 10)}
                  onChange={async (e) => {
                    try {
                      const updated = await updateTask(
                        task.id,
                        { due_date: e.target.value }
                      );
                      applyTaskUpdate(updated);
                    } catch {
                      alert("Failed to update due date");
                    }
                  }}
                  className="p-1 rounded bg-white text-gray-900 text-sm"
                />
              </div>

              {task.description && (
                <p className="text-sm text-gray-300">
                  {task.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tasks;
