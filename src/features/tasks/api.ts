import { apiClient } from '../../api/client';
import type { Task, CreateTaskDto, UpdateTaskDto } from './types';

export const tasksApi = {
  getAll: () => apiClient<Task[]>('/tasks'),
  getById: (id: string) => apiClient<Task>(`/tasks/${id}`),
  create: (dto: CreateTaskDto) =>
    apiClient<Task>('/tasks', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: UpdateTaskDto) =>
    apiClient<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  remove: (id: string) =>
    apiClient<void>(`/tasks/${id}`, { method: 'DELETE' }),
};