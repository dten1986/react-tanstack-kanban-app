import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import type { Task, TaskStatus } from '../types';

interface ColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

export function Column({ status, title, tasks }: ColumnProps) {
  return (
    <section className="flex min-h-40 flex-col gap-3 rounded-xl border border-line bg-surface p-3.5">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] tracking-wider uppercase">{title}</h2>
        <span className="min-w-5.5 rounded-full bg-accent-soft px-1.75 py-0.5 text-center text-xs text-accent">
          {tasks.length}
        </span>
      </header>

      <div className="flex flex-col gap-2.5">
        {tasks.length === 0 ? (
          <p className="py-3.5 text-center text-sm opacity-65">
            No tasks here yet.
          </p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      <AddTaskForm status={status} />
    </section>
  );
}
