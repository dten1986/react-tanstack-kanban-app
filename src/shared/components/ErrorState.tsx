import { Button } from './Button';

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div
      className="mx-auto my-12 max-w-120 rounded-xl border border-line bg-surface p-7 text-center"
      role="alert"
    >
      <h2 className="mb-2 text-xl">Something went wrong</h2>
      <p className="mb-4.5 text-sm text-danger">{error.message}</p>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  );
}
