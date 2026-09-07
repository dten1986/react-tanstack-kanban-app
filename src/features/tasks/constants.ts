import type { TaskStatus } from './types';

export const COLUMNS = [
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
] as const satisfies readonly { status: TaskStatus; title: string }[];

export const STATUS_ORDER: TaskStatus[] = ['todo', 'in-progress', 'done'];
