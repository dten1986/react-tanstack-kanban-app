import { Board } from './features/tasks/components/Board';
import { DevFailureToggle } from './features/tasks/components/DevFailureToggle';

function App() {
  return (
    <div className="mx-auto max-w-[1126px] px-5 pt-6 pb-16">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl tracking-tight">Kanban</h1>
        <DevFailureToggle />
      </header>
      <Board />
    </div>
  );
}

export default App;
