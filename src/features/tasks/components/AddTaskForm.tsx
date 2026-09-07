import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useCreateTask } from '../hooks/useCreateTask';
import { Button } from '../../../shared/components/Button';
import type { TaskStatus } from '../types';

interface AddTaskFormProps {
  status: TaskStatus;
}

export function AddTaskForm({ status }: AddTaskFormProps) {
  // Єдиний useState у застосунку: це UI-стан інпута, а не серверні дані.
  const [title, setTitle] = useState('');
  const { mutate, isPending, isError, error, reset } = useCreateTask();

  const trimmed = title.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmed || isPending) return;

    mutate(
      { title: trimmed, status },
      // Call-level onSuccess: чистимо інпут лише для цього конкретного виклику.
      { onSuccess: () => setTitle('') }
    );
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    if (isError) reset();
  }

  return (
    <form className="mt-auto flex flex-wrap gap-2" onSubmit={handleSubmit}>
      <input
        className="min-w-0 flex-[1_1_120px] rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-sm text-ink-strong focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
        value={title}
        onChange={handleChange}
        placeholder="New task…"
        aria-label="New task title"
        disabled={isPending}
      />
      <Button type="submit" disabled={isPending || !trimmed}>
        {isPending ? 'Adding…' : 'Add'}
      </Button>
      {isError && (
        <p className="basis-full text-[13px] text-danger">{error.message}</p>
      )}
    </form>
  );
}
