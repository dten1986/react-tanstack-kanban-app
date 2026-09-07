import { COLUMNS } from '../constants';

const PLACEHOLDER_CARDS = [0, 1, 2];

const SKELETON_CARD =
  'h-16 animate-shimmer rounded-[10px] bg-[length:400%_100%] motion-reduce:animate-none ' +
  'bg-[linear-gradient(90deg,var(--color-skeleton)_25%,var(--color-skeleton-hi)_37%,var(--color-skeleton)_63%)]';

export function BoardSkeleton() {
  return (
    <div aria-busy="true">
      <div className="grid grid-cols-1 items-start gap-4 min-[860px]:grid-cols-3">
        {COLUMNS.map((column) => (
          <section
            className="flex min-h-40 flex-col gap-3 rounded-xl border border-line bg-surface p-3.5"
            key={column.status}
          >
            <header className="flex items-center justify-between gap-2">
              <h2 className="text-[15px] tracking-wider uppercase">
                {column.title}
              </h2>
            </header>
            <div className="flex flex-col gap-2.5">
              {PLACEHOLDER_CARDS.map((index) => (
                <div className={SKELETON_CARD} key={index} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
