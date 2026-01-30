import api from "./client";

export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  priority: TaskPriority;
  due_date: string;
  description?: string;
}

export interface TaskUpdate {
  title?: string;
  priority?: string;
  due_date?: string;
  description?: string;
  status?: TaskStatus;
}

export async function getTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>("/tasks");
  return response.data;
}

export async function createTask(
  data: TaskCreate
): Promise<Task> {
  const response = await api.post<Task>("/tasks", data);
  return response.data;
}

export async function updateTask(
  taskId: string,
  data: TaskUpdate
): Promise<Task> {
  const response = await api.patch<Task>(
    `/tasks/${taskId}`,
    data
  );
  return response.data;
}

export async function deleteTask(
  taskId: string
): Promise<void> {
  await api.delete(`/tasks/${taskId}`);
}
