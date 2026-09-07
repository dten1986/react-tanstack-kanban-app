import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api';
import { taskKeys } from '../queryKeys';
import type { Task } from '../types';

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      const previous = queryClient.getQueryData<Task[]>(taskKeys.list());

      queryClient.setQueryData<Task[]>(taskKeys.list(), (old) =>
        old?.filter((task) => task.id !== id)
      );

      return { previous };
    },

    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(taskKeys.list(), context.previous);
      }
    },

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
  });
}
