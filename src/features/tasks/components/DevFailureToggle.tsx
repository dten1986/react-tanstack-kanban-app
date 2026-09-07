import { useSyncExternalStore } from 'react';
import {
  getForcedUpdateFailure,
  setForcedUpdateFailure,
  subscribeForcedUpdateFailure,
} from '../devFailure';

/**
 * Демонстрація rollback: увімкни — і будь-яке переміщення картки впаде,
 * а оптимістичний запис відкотиться до знімка з `onMutate`.
 */
export function DevFailureToggle() {
  const forced = useSyncExternalStore(
    subscribeForcedUpdateFailure,
    getForcedUpdateFailure,
    () => false
  );

  if (!import.meta.env.DEV) return null;

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-line px-2.5 py-1.5 text-[13px] select-none">
      <input
        type="checkbox"
        className="accent-accent"
        checked={forced}
        onChange={(event) => setForcedUpdateFailure(event.target.checked)}
      />
      Force update failure
    </label>
  );
}
