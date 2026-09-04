export type Status = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  order: number;
}

// DTO — дані для створення (без id, його дає сервер)
export type CreateTaskDto = Omit<Task, 'id'>;
export type UpdateTaskDto = Partial<Omit<Task, 'id'>>;