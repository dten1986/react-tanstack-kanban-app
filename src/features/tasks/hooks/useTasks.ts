import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { tasksApi } from '../api';
import { taskKeys } from '../queryKeys';
import type { Task } from '../types';

/**
 * Єдиний запит на всю дошку. Колонки — це похідні дані (`select`),
 * а не окремі запити: у DevTools завжди рівно один запис ['tasks','list',{}].
 */
export function useTasks<TData = Task[]>(
  select?: (tasks: Task[]) => TData
): UseQueryResult<TData, Error> {
  return useQuery<Task[], Error, TData>({
    queryKey: taskKeys.list(),
    queryFn: tasksApi.getAll,
    select,
    staleTime: 30_000,
  });
}
