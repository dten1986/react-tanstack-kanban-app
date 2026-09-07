/**
 * Dev-only перемикач: змушує `tasksApi.update` відхилятись, щоб було видно
 * як оптимістичне оновлення відкочується назад (rollback у `onError`).
 * Живе поза React, читається через `useSyncExternalStore` — жодного дублювання стану.
 */
let forced = false;
const listeners = new Set<() => void>();

export function getForcedUpdateFailure(): boolean {
  return forced;
}

export function setForcedUpdateFailure(value: boolean): void {
  if (forced === value) return;
  forced = value;
  for (const listener of listeners) listener();
}

export function subscribeForcedUpdateFailure(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
