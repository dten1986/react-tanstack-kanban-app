import { useTasksByStatus } from '../hooks/useTasksByStatus';
import { COLUMNS } from '../constants';
import { Column } from './Column';
import { BoardSkeleton } from './BoardSkeleton';
import { RefetchIndicator } from './RefetchIndicator';
import { ErrorState } from '../../../shared/components/ErrorState';

export function Board() {
  const { data, isPending, isError, error, isFetching, refetch } =
    useTasksByStatus();

  // isPending — саме "даних ще немає"; isFetching окремо нижче,
  // щоб фоновий рефетч не розмонтовував дошку.
  if (isPending) return <BoardSkeleton />;
  if (isError) {
    return <ErrorState error={error} onRetry={() => void refetch()} />;
  }

  return (
    <div>
      {isFetching && <RefetchIndicator />}
      <div className="grid grid-cols-1 items-start gap-4 min-[860px]:grid-cols-3">
        {COLUMNS.map((column) => (
          <Column
            key={column.status}
            status={column.status}
            title={column.title}
            tasks={data[column.status]}
          />
        ))}
      </div>
    </div>
  );
}
