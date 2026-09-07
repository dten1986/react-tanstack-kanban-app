import { useUpdateTask } from '../hooks/useUpdateTask';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { STATUS_ORDER } from '../constants';
import { Button } from '../../../shared/components/Button';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  // Окремий інстанс мутації на картку — pending-стан локальний,
  // спінер не з'являється одразу на всій дошці.
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const isBusy = updateTask.isPending || deleteTask.isPending;
  const index = STATUS_ORDER.indexOf(task.status);
  const canMoveLeft = index > 0;
  const canMoveRight = index >= 0 && index < STATUS_ORDER.length - 1;

  function move(offset: -1 | 1) {
    const next = STATUS_ORDER[index + offset];
    if (!next) return;
    updateTask.mutate({ id: task.id, patch: { status: next } });
  }

  return (
    <article
      className={`rounded-[10px] border border-line bg-canvas p-3 text-left transition ${
        isBusy ? 'opacity-55' : 'hover:shadow-card'
      }`}
    >
      <h3 className="text-[15px] leading-snug">{task.title}</h3>
      {task.description && (
        <p className="mt-1.5 text-[13px] opacity-80">{task.description}</p>
      )}

      <div className="mt-2.5 flex gap-1.5">
        <Button
          variant="icon"
          onClick={() => move(-1)}
          disabled={isBusy || !canMoveLeft}
          aria-label={`Move "${task.title}" to previous column`}
          title="Move left"
        >
          ←
        </Button>
        <Button
          variant="icon"
          onClick={() => move(1)}
          disabled={isBusy || !canMoveRight}
          aria-label={`Move "${task.title}" to next column`}
          title="Move right"
        >
          →
        </Button>
        <Button
          variant="icon"
          tone="danger"
          className="ml-auto"
          onClick={() => deleteTask.mutate(task.id)}
          disabled={isBusy}
          aria-label={`Delete "${task.title}"`}
          title="Delete"
        >
          ×
        </Button>
      </div>
    </article>
  );
}
