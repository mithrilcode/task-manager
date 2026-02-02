import { useState } from "react";
import { createTask } from "../api/tasks";
import type { Task, TaskCreate } from "../api/tasks";

type TaskFormProps = {
  onCreate: (task: Task) => void;
};

const TaskForm = ({ onCreate }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] =
    useState<TaskCreate["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setError(null);

    if (!title || !dueDate) {
      setError("Title and due date are required");
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

      onCreate(newTask);

      setTitle("");
      setPriority("medium");
      setDueDate("");
      setDescription("");
    } catch {
      setError("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-6 border border-white/20 rounded space-y-4"
    >
      <h2 className="font-semibold text-lg">
        Create Task
      </h2>

      {error && (
        <p className="text-red-400 text-sm">
          {error}
        </p>
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
        onChange={(e) =>
          setDescription(e.target.value)
        }
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
  );
};

export default TaskForm;
