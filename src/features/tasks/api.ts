import { apiClient } from '../../api/client';
import { getForcedUpdateFailure } from './devFailure';
import type { Task, CreateTaskInput, UpdateTaskInput } from './types';

export const tasksApi = {
  getAll: () => apiClient<Task[]>('/tasks'),

  getById: (id: string) => apiClient<Task>(`/tasks/${id}`),

  /** id призначає сервер; createdAt проставляємо тут, щоб json-server лишався "тупим". */
  create: (input: CreateTaskInput) =>
    apiClient<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ ...input, createdAt: new Date().toISOString() }),
    }),

  update: async (id: string, patch: UpdateTaskInput['patch']) => {
    if (import.meta.env.DEV && getForcedUpdateFailure()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      throw new Error('Forced failure (dev toggle) — update rejected');
    }
    return apiClient<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  remove: (id: string) =>
    apiClient<unknown>(`/tasks/${id}`, { method: 'DELETE' }),
};
