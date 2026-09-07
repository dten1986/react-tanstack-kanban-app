import { useTasks } from './useTasks';
import { COLUMNS } from '../constants';
import type { Task, TasksByStatus } from '../types';

/**
 * Модульного рівня (стабільне посилання) — інлайн-функція ламала б
 * мемоізацію `select` і перераховувала групування на кожен рендер.
 */
function groupByStatus(tasks: Task[]): TasksByStatus {
  const grouped = {} as TasksByStatus;
  for (const column of COLUMNS) grouped[column.status] = [];

  for (const task of tasks) {
    const bucket = grouped[task.status];
    // Невідомий статус із сервера просто ігноруємо, а не ламаємо дошку.
    if (bucket) bucket.push(task);
  }

  for (const column of COLUMNS) {
    grouped[column.status].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  return grouped;
}

export function useTasksByStatus() {
  return useTasks(groupByStatus);
}
