# Custom Hooks

All hooks are exported from `src/hooks/index.ts`. General-purpose hooks are defined in that file; feature hooks have their own files in `src/hooks/`. Each hook carries a JSDoc block with an example, so read the source for details. This page is the map.

## General purpose (`src/hooks/index.ts`)

| Hook | Use it for | Returns |
| --- | --- | --- |
| `useLocalStorage<T>(key, initialValue)` | State that persists to `localStorage`, with JSON parsing and storage errors handled | `[value, setValue]` like `useState` |
| `useClickOutside<T>(callback)` | Running a callback when a click lands outside an element | a ref to attach |
| `useDebounce<T>(value, delay)` | Delaying a fast-changing value | the debounced value |
| `useWindowSize(debounceDelay = 150)` | Debounced window dimensions, safe without `window` | `{ width, height }` |
| `useFormValidation(initialValues, validationRules)` | Field values, per-field rule arrays, and touched/error state | `values`, `errors`, `touched`, `handleChange`, `handleBlur`, `validateAll`, `resetForm`, `setValues` |
| `useAsync(asyncFunction)` | Tracking an async call's status | `execute`, `status`, `data`, `error`, `isLoading` |
| `useScrollReveal(options?)` | Revealing an element the first time it enters the viewport; the observer stops after that | `{ ref, isVisible }` |

## Feature hooks

| Hook | File | What it does |
| --- | --- | --- |
| `useContactForm(onSuccess, onError)` | `useContactForm.ts` | The contact form: EmailJS submission, validation (built on `useFormValidation`, `useDebounce`, and `useAsync`), draft persistence, and a mailto fallback when sending fails. Returns the form ref, values, errors, handlers, and display helpers. |
| `useActiveTrip(tripIds)` | `useActiveTrip.ts` | Tracks which trip section is most visible, keeps the URL hash in sync while scrolling, and returns the active trip id. |
| `useSnakeGame(config)` | `useSnakeGame.ts` | The canvas Snake game: movement, apples, collisions, and scoring, with the high score in `localStorage`. Returns score state plus `toggleRunning` and `restart`. |
| `usePageTracking()` | `usePageTracking.ts` | Sends a Google Analytics 4 page view on each route change, in production only (not on `localhost` or `127.0.0.1`). |
| `usePrefetchRoutes()` | `usePrefetchRoutes.ts` | Once the browser is idle after load, prefetches the lazy route chunks so the first visit to each is served from cache. |

## Adding a hook

- Put a general-purpose hook in `src/hooks/index.ts`, and a feature hook in its own `src/hooks/useName.ts` re-exported from `index.ts`.
- Give it a JSDoc block with an example, matching the existing hooks.
- Clean up listeners, observers, and timers in the effect's cleanup function.
- Add a row to the matching table above.
