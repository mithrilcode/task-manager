import { useState } from "react";
import { updateTask, deleteTask } from "../api/tasks";
import type { Task, TaskUpdate } from "../api/tasks";

type TaskItemProps = {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
};

const TaskItem = ({ task, onUpdate, onDelete }: TaskItemProps) => {
  const [title, setTitle] = useState(task.title);
  const [savingTitle, setSavingTitle] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleBlur = async () => {
    if (title === task.title) return;

    try {
      setSavingTitle(true);
      setError(null);

      const updated = await updateTask(task.id, { title });
      onUpdate(updated);
    } catch {
      setError("Failed to update title");
      setTitle(task.title);
    } finally {
      setSavingTitle(false);
    }
  };

  const toggleStatus = async () => {
    try {
      setIsUpdating(true);
      setError(null);

      const updated = await updateTask(task.id, {
        status: task.status === "done" ? "todo" : "done",
      });
      onUpdate(updated);
    } catch {
      setError("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityChange = async (
    value: TaskUpdate["priority"]
  ) => {
    try {
      setIsUpdating(true);
      setError(null);

      const updated = await updateTask(task.id, {
        priority: value,
      });
      onUpdate(updated);
    } catch {
      setError("Failed to update priority");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDueDateChange = async (value: string) => {
    try {
      setIsUpdating(true);
      setError(null);

      const updated = await updateTask(task.id, {
        due_date: value,
      });
      onUpdate(updated);
    } catch {
      setError("Failed to update due date");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError(null);

      await deleteTask(task.id);
      onDelete(task.id);
    } catch {
      setError("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li className="border border-white/20 rounded p-4 space-y-2">
      <div className="flex justify-between gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          disabled={savingTitle || isUpdating || isDeleting}
          className="bg-transparent border-b border-white/30 focus:outline-none flex-1 text-white disabled:opacity-50"
        />

        <div className="flex gap-3 text-sm">
          <button
            onClick={toggleStatus}
            disabled={isUpdating || isDeleting}
            className="text-indigo-400 hover:underline disabled:opacity-50"
          >
            {isUpdating
              ? "Saving…"
              : task.status === "done"
              ? "Mark Todo"
              : "Mark Done"}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-400 hover:underline disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <select
          value={task.priority}
          disabled={isUpdating || isDeleting}
          onChange={(e) =>
            handlePriorityChange(
              e.target.value as TaskUpdate["priority"]
            )
          }
          className="p-1 rounded bg-white text-gray-900 text-sm disabled:opacity-50"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={task.due_date.slice(0, 10)}
          disabled={isUpdating || isDeleting}
          onChange={(e) =>
            handleDueDateChange(e.target.value)
          }
          className="p-1 rounded bg-white text-gray-900 text-sm disabled:opacity-50"
        />
      </div>

      {task.description && (
        <p className="text-sm text-gray-300">
          {task.description}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </li>
  );
};

export default TaskItem;
