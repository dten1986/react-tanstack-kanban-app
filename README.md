# React Kanban — TanStack Query Demo

A small Kanban board built to demonstrate practical **TanStack Query v5** usage in a
React + TypeScript codebase: queries, mutations, cache invalidation, and optimistic
updates with rollback.

The backend is a local `json-server`, so every mutation is a real HTTP request that
persists — no faked responses.

---

## Stack

| Layer | Choice |
|---|---|
| Build | Vite |
| UI | React 19 + TypeScript |
| Server state | @tanstack/react-query v5 |
| Debugging | @tanstack/react-query-devtools |
| API | json-server (`db.json`) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |

No global client-state library. All server state lives in the React Query cache;
only ephemeral UI state (form inputs) uses `useState`. That separation is the point
of the project.

---

## Getting started

```bash
npm install

# terminal 1 — API on http://localhost:3001
npm run api

# terminal 2 — app on http://localhost:5173
npm run dev
```

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "api": "json-server db.json --port 3001"
  }
}
```

The API port is **3001**, not 3000 — that is what `src/api/client.ts` points at. There is
no `start` script: combining the two would need `concurrently`, and the brief forbids new
dependencies.

---

## Data model

`db.json`:

```json
{
  "tasks": [
    {
      "id": "1",
      "title": "Set up the project",
      "description": "Vite + React + TS + React Query",
      "status": "done",
      "createdAt": "2026-09-01T10:00:00.000Z"
    }
  ]
}
```

```ts
// src/features/tasks/types.ts
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt'>;
export type UpdateTaskInput = { id: string; patch: Partial<CreateTaskInput> };
export type TasksByStatus = Record<TaskStatus, Task[]>;
```

---

## Project structure

Feature-based. Everything task-related is co-located; nothing outside `features/tasks`
imports from `api.ts` directly — components only ever touch hooks.

```
src/
├── main.tsx                     # QueryClientProvider + Devtools + MutationCache
├── App.tsx                      # renders <Board />
├── index.css                    # @import 'tailwindcss' + @theme tokens
├── shared/
│   └── components/
│       ├── Button.tsx
│       ├── ErrorState.tsx
│       └── Spinner.tsx
└── features/
    └── tasks/
        ├── types.ts
        ├── api.ts               # fetch wrappers, throws on !res.ok
        ├── queryKeys.ts         # hierarchical key factory
        ├── constants.ts         # COLUMNS config, status order
        ├── devFailure.ts        # dev-only "make update fail" store
        ├── hooks/
        │   ├── useTasks.ts
        │   ├── useTasksByStatus.ts
        │   ├── useCreateTask.ts
        │   ├── useUpdateTask.ts
        │   └── useDeleteTask.ts
        └── components/
            ├── Board.tsx
            ├── BoardSkeleton.tsx
            ├── Column.tsx
            ├── TaskCard.tsx
            ├── AddTaskForm.tsx
            ├── RefetchIndicator.tsx
            └── DevFailureToggle.tsx
```

### Query key factory

```ts
// src/features/tasks/queryKeys.ts
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: object = {}) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};
```

Invalidation targets `taskKeys.lists()` (prefix match) so detail entries are left alone.

---

## What this demo shows

1. **`useQuery` fundamentals** — `isPending` vs `isFetching`, TS narrowing via early
   returns, `select` for derived data, `staleTime` tuning.
2. **Mutations + invalidation** — `useMutation`, hook-level vs call-level callbacks,
   returning the invalidation promise to keep `isPending` accurate.
3. **Optimistic updates** — `onMutate`, `cancelQueries`, snapshot/rollback via `context`,
   `onSettled` reconciliation.
4. **Production patterns** — custom hooks wrapping every query, hierarchical key factory,
   global error handling through `MutationCache`, DevTools-driven debugging.

---

## Implementation status

| Area | State |
|---|---|
| Project setup, Devtools, json-server | done |
| Types, `api.ts`, `queryKeys.ts` | done |
| Query hooks (`useTasks`, `useTasksByStatus`) | done |
| Mutation hooks (create / update / delete) | done |
| Board / Column / TaskCard / AddTaskForm | done |
| Loading, error, empty states | done |
| Optimistic updates | done |
| Styling pass | done |

Verified locally: `npm run build` and `npm run lint` both exit clean, and create / move /
delete were exercised against a live `json-server` (`POST` → `PATCH` → `DELETE` round-trip)
so persistence across reload is real, not mocked.

---

## Codegen specification

> This section is a precise brief for finishing the remaining UI. Follow it literally —
> the architectural choices below are deliberate and are the subject of the demo.

### Hard rules

- **TanStack Query v5 API only.** `isPending` (not `isLoading` for the "no data yet"
  case), object-form signatures (`useQuery({ queryKey, queryFn })`), `placeholderData`
  instead of the removed `keepPreviousData` option.
- **No `any`.** Every hook explicitly typed. `strict: true` must pass.
- **Components never call `fetch` or `useQuery` directly** — only the custom hooks in
  `features/tasks/hooks`.
- **No client-side duplication of server state.** Never copy `data` into `useState`.
- One `useQuery` for the whole board (`taskKeys.list()`), grouped client-side via
  `select`. Do **not** issue one request per column.
- ~~No new dependencies. No UI kit, no Tailwind, no drag-and-drop library.~~
  **Superseded:** styling is now Tailwind CSS v4. Still no UI kit and no
  drag-and-drop library — `tailwindcss` + `@tailwindcss/vite` are the only additions,
  both dev dependencies.
- Utility classes in the markup; design tokens in `@theme` in `index.css`. No BEM,
  no co-located `.css` files, no `styled-*`.

### Components to produce

**`Board.tsx`**
- Calls `useTasksByStatus()`.
- `isPending` → render `<BoardSkeleton />`.
- `isError` → render `<ErrorState error={error} onRetry={refetch} />`.
- Otherwise render one `<Column />` per entry in `COLUMNS`, plus `<RefetchIndicator />`
  when `isFetching` is true and data is already present.
- The board must not unmount/blink during background refetches.

**`constants.ts`**
```ts
export const COLUMNS = [
  { status: 'todo',        title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done',        title: 'Done' },
] as const satisfies readonly { status: TaskStatus; title: string }[];

export const STATUS_ORDER: TaskStatus[] = ['todo', 'in-progress', 'done'];
```

**`useTasksByStatus.ts`**
- Wraps `useTasks()` with `select` returning `TasksByStatus`.
- Every status from `COLUMNS` must exist as a key, with `[]` when empty — no `undefined`
  reaching components.
- The `select` function must be module-level (stable reference), not inline.

**`Column.tsx`** — presentational. Props: `status`, `title`, `tasks`. Renders header with
title and task count, the card list, an empty-state message when `tasks.length === 0`,
and `<AddTaskForm status={status} />` at the bottom.

**`TaskCard.tsx`** — props: `task`. Uses `useUpdateTask()` and `useDeleteTask()` locally
(one mutation instance per card, so pending state is per-card). Renders title, left/right
move buttons bounded by `STATUS_ORDER`, and a delete button. All buttons disabled while
either mutation is pending; edge buttons disabled at the ends of the order.

**`AddTaskForm.tsx`** — controlled `title` input plus submit button. Trims input, ignores
empty submissions, disables both controls while pending, clears the input via the
call-level `onSuccess` passed to `mutate`, shows `error.message` on failure and calls
`reset()` when the user edits the input again.

**`BoardSkeleton.tsx`** — three column placeholders with two or three shimmering card
placeholders each. CSS-only animation.

**`ErrorState.tsx`** — props: `error: Error`, `onRetry?: () => void`. Shows the message
and a retry button when `onRetry` is provided.

**`RefetchIndicator.tsx`** — thin fixed bar or subtle badge; must never cover content or
shift layout.

### Optimistic updates (final step)

Apply to `useUpdateTask` and `useDeleteTask`. `useCreateTask` stays invalidation-only —
the server assigns the `id`, and the README should state that as the deliberate reason.

Required shape:

```ts
onMutate: async (variables) => {
  await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
  const previous = queryClient.getQueryData<Task[]>(taskKeys.list());
  queryClient.setQueryData<Task[]>(taskKeys.list(), (old) => /* apply change */);
  return { previous };
},
onError: (_err, _vars, context) => {
  if (context?.previous) {
    queryClient.setQueryData(taskKeys.list(), context.previous);
  }
},
onSettled: () => queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
```

- `cancelQueries` is mandatory — without it an in-flight refetch can land after the
  optimistic write and overwrite it.
- The context type must be inferred correctly; do not cast.
- Add a way to demonstrate rollback: an env-flag or a dev-only toggle that makes
  `updateTask` reject, so the UI visibly reverts.

### Acceptance criteria

- `npm run build` and `npm run lint` pass with zero errors.
- Creating, moving, and deleting tasks persists across a page reload.
- Moving a card is visually instant; a forced failure reverts it to its original column.
- Stopping json-server and reloading shows the error state with a working retry.
- No console warnings, no unhandled promise rejections.
- DevTools shows exactly one `['tasks','list',{}]` entry, regardless of card count.

---

## Changes in this pass

Everything below was added to close out the codegen spec. Nothing outside
`features/tasks`, `shared/components`, `main.tsx`, `App.tsx` and `index.css` was touched.

### Added

- **`constants.ts`** — `COLUMNS` (`as const satisfies`) and `STATUS_ORDER`, exactly as
  specified. `COLUMNS` is the single source of truth for both the board and the grouping.
- **`hooks/`** — `hooks.ts` was empty, so it was deleted and replaced by the five files the
  structure calls for.
  - `useTasks` is generic over the `select` result, so `useTasksByStatus` can layer on top
    of it without a second `useQuery`.
  - `groupByStatus` is module-level. It seeds a bucket for every `COLUMNS` entry first, so
    a component can never receive `undefined` for an empty column, and it sorts each bucket
    by `createdAt` so cards do not jump around after a refetch.
  - A task whose status is not in `COLUMNS` is skipped rather than crashing the board.
- **Components** — `Board`, `Column`, `TaskCard`, `AddTaskForm`, `BoardSkeleton`,
  `RefetchIndicator`, plus `shared/components/{Spinner,ErrorState}`.
- **`DevFailureToggle.tsx` + `devFailure.ts`** — the spec asked for "an env-flag or a
  dev-only toggle" to demonstrate rollback but did not name a file. A UI toggle beats an
  env flag here: you can flip it and watch a card snap back without restarting the dev
  server. The flag lives in a plain module and is read with `useSyncExternalStore`, so it
  stays out of React state and `api.ts` can consult it without importing React. It is
  guarded by `import.meta.env.DEV` and drops out of production builds.
- **`main.tsx`** — a `MutationCache` with a global `onError` for logging, and query
  defaults (`staleTime: 30s`, `retry: 1`, no refetch-on-focus) so the demo is not noisy.
- **`index.css`** — full BEM-ish stylesheet, light/dark via `prefers-color-scheme`, CSS-only
  skeleton shimmer, and a `prefers-reduced-motion` opt-out. `App.css` (Vite template
  leftovers) was deleted.

### Deviations from the brief, and why

- **Status is now `in-progress`, not `in_progress`.** `types.ts` and `db.json` were on the
  old underscore spelling while the brief's data model and `COLUMNS` block use the hyphen.
  The brief wins; `db.json` was reseeded to match. Same for the data model swap of `order`
  → `createdAt`.
- **`api.ts` and `queryKeys.ts` were marked "done" but did not match the brief.** `api.ts`
  used `CreateTaskDto`/`UpdateTaskDto`, and `queryKeys` had no `list()` or `details()` —
  which the acceptance criterion about a single `['tasks','list',{}]` entry requires. Both
  were brought in line.
- **`tasksApi.create` stamps `createdAt` client-side.** `CreateTaskInput` omits it and
  json-server will not invent it, so the api layer fills it in and lets the server keep
  assigning `id`.
- **`strict: true` was missing from `tsconfig.app.json`.** The brief requires it to pass, so
  it was enabled. The build is clean under it.
- **The page header lives in `App.tsx`, not `Board.tsx`.** `Board` early-returns on
  `isPending` / `isError` as specified, so anything rendered inside it would vanish in those
  states — including the dev toggle, which is most useful when things are failing.

### Styling: Tailwind CSS v4

The hand-written stylesheet was replaced with Tailwind. This contradicts the "no Tailwind"
hard rule above, which was an explicit later instruction, so the rule is struck through
rather than quietly ignored.

- **Setup** is the v4 Vite plugin — `@tailwindcss/vite` in `vite.config.ts` and a single
  `@import 'tailwindcss'` in `index.css`. No `tailwind.config.js`, no PostCSS config, no
  `content` globs: v4 configures itself from CSS and scans automatically.
- **Tokens live in `@theme`** — `canvas`, `surface`, `line`, `ink`, `ink-strong`, `accent`,
  `accent-soft`, `accent-line`, `danger`, `skeleton`. They generate the real utilities
  (`bg-surface`, `border-line`, `text-ink-strong`, …), so the palette stays a closed set
  instead of scattered hex values.
- **Dark mode uses no `dark:` variants at all.** Tailwind compiles colour utilities down to
  `var(--color-*)`, so a `@media (prefers-color-scheme: dark)` block that redefines those
  same variables on `:root` re-themes the entire app. Every element is themed exactly once,
  at the token layer — which is also how the original CSS worked.
- **Animations are tokens too** — `--animate-spinner` and `--animate-shimmer` with their
  `@keyframes` inside `@theme`, giving `animate-spinner` / `animate-shimmer`. Both carry
  `motion-reduce:animate-none`.
- **`shared/components/Button.tsx` is new.** Five buttons across three components shared a
  ten-utility string; repeating it is how utility CSS goes wrong. A `variant`
  (`default` | `icon`) / `tone` (`neutral` | `danger`) component is the idiomatic fix and
  keeps the JSX readable. It extends `ButtonHTMLAttributes`, so `disabled`, `aria-label`
  and `onClick` pass straight through.
- **`@apply` is used exactly twice**, both in `@layer base` for `body` and headings. Element
  defaults are the one place it earns its keep; everywhere else the utilities are inline.
- `src/index.css` shrank from a 300-line stylesheet to ~80 lines of tokens. The built CSS
  is 16 kB raw / 4.2 kB gzipped.

Verified in a real browser (Chrome via Playwright) at both colour schemes: light, dark and
the loading skeleton all render correctly, with no console errors or warnings. The
optimistic move, the forced-failure rollback, create-then-reload persistence and delete
were all re-tested through the UI after the restyle.

### Why `useCreateTask` has no optimistic update

Deliberate, and it is the interesting half of the lesson. The server assigns `id`. An
optimistic card would have to carry a fake one, and every control on it — the move buttons,
the delete button, the React `key` — keys off that id. Until the refetch lands you would be
issuing `PATCH /tasks/temp-123` against a row that does not exist. Update and delete do not
have this problem: the row already exists and its id is already known, which is exactly why
those two are optimistic and create is not.

### Demonstrating rollback

1. `npm run api` and `npm run dev`.
2. Tick **Force update failure** in the header.
3. Move any card. It jumps to the next column instantly, then snaps back when the rejected
   request resolves — that is `onError` restoring the `onMutate` snapshot.
4. Watch the DevTools cache while doing it: the list entry flips to the optimistic value and
   back, and there is still only one `['tasks','list',{}]` entry no matter how many cards
   are on the board.

---

## License

MIT
