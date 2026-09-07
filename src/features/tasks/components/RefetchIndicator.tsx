import { Spinner } from '../../../shared/components/Spinner';

/**
 * Fixed-бар поверх viewport: не займає місця в потоці, тож фонові рефетчі
 * не смикають layout дошки.
 */
export function RefetchIndicator() {
  return (
    <div
      className="pointer-events-none fixed top-3 right-3 z-10 flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft px-3 py-1.5 text-xs text-accent"
      aria-live="polite"
    >
      <Spinner label="Refreshing tasks" />
      <span>Syncing…</span>
    </div>
  );
}
