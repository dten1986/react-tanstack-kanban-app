import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api';
import { taskKeys } from '../queryKeys';
import type { CreateTaskInput } from '../types';

/**
 * Свідомо БЕЗ оптимістичного оновлення: id генерує сервер, тож тимчасова
 * картка жила б із фейковим id — і кнопки move/delete на ній були б зламані
 * до моменту рефетчу. Тут чесна інвалідація.
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
    // Повертаємо проміс — isPending лишається true, доки список не перезавантажено.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
  });
}
