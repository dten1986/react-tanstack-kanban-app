import './App.css'

import { useQuery } from '@tanstack/react-query';

function App() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/todos?_limit=5').then((r) =>
        r.json()
      ),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return (
    <ul>
      {data.map((t: { id: number; title: string }) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ul>
  );
}

export default App
