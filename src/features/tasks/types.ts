export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
}

/** Створення: id і createdAt проставляються поза формою (сервер / api-шар). */
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt'>;
export type UpdateTaskInput = { id: string; patch: Partial<CreateTaskInput> };
export type TasksByStatus = Record<TaskStatus, Task[]>;
