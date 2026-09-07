import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api';
import { taskKeys } from '../queryKeys';
import type { Task, UpdateTaskInput } from '../types';

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: UpdateTaskInput) => tasksApi.update(id, patch),

    onMutate: async ({ id, patch }) => {
      // Обов'язково: інакше рефетч "у польоті" приземлиться після нашого
      // оптимістичного запису і затре його старими даними.
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      const previous = queryClient.getQueryData<Task[]>(taskKeys.list());

      queryClient.setQueryData<Task[]>(taskKeys.list(), (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...patch } : task))
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(taskKeys.list(), context.previous);
      }
    },

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
  });
}
