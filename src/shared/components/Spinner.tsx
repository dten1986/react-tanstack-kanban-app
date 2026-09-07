interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <span
      className="inline-block size-3.5 animate-spinner rounded-full border-2 border-accent-line border-t-transparent motion-reduce:animate-none"
      role="status"
      aria-label={label}
    />
  );
}
