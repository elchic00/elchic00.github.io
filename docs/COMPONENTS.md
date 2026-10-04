# Shared Components

Reusable UI lives in `src/components/shared/` and is exported from `src/components/index.ts`. Check here before writing a one-off version. Props, defaults, and behavior below come from the source files; when they disagree, the source wins.

## Dialogs

### `Modal`

Portal-rendered dialog that the other dialogs build on. On open it moves focus inside and traps Tab within it; on close or Escape it restores focus to the element that opened it. It does not lock body scroll.

| Prop | Default |
| --- | --- |
| `isOpen`, `onClose`, `children` | required |
| `showCloseButton` | `true` |
| `closeOnBackdropClick` | `true` |
| `closeOnEscape` | `true` |
| `maxWidth` (`sm` · `md` · `lg` · `xl` · `2xl`) | `lg` |
| `ariaLabel` | `"Modal dialog"` |

### `ConfirmDialog`

Confirmation built on `Modal`. Use it instead of `window.confirm()`.

Props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmText` (default `"Confirm"`), `cancelText` (default `"Cancel"`), and `variant` (`danger` · `warning` · `info` · `neutral`, default `warning`).

### `Alert` and `useAlert`

A centered alert dialog for `success`, `error`, or `warning` results, with a title, message, and optional footer. It stays open until dismissed; it is not a toast.

```tsx
const { fire, AlertComponent } = useAlert();
fire({ type: "success", title: "Message sent", message: "Thanks, I'll reply soon." });
return <>{AlertComponent}</>;
```

## Notifications

### `ToastProvider`, `useToast`, `ToastContainer`

App-wide toasts. `ToastProvider` (`src/contexts/ToastContext.tsx`) and `ToastContainer` are mounted in `src/App.tsx`. Call `useToast().showToast(message, type, duration)`; `type` is `success` · `error` · `info` · `warning` (default `info`), and `duration` defaults to 4000 ms, with `0` keeping the toast until dismissed. Use this rather than a local notification system.

## Controls and media

### `Button`

`variant`: `primary` · `secondary` · `neutral` · `ghost` (default `primary`). `size`: `sm` · `md` · `lg` (default `md`). Also takes `loading`, `disabled`, `ariaLabel`, and `type` (default `button`), and passes other props through to the `<button>`.

### `ImageWithLoader`

Shows a skeleton until the image loads, then fades it in. `loading` defaults to `lazy`.

### `VideoPlayer`

Muted, looping, inline video that plays when at least half of it is on screen and pauses when it scrolls away. If the browser blocks autoplay, or the visitor prefers reduced motion, it shows a play button instead. `projectIndex` below 2 preloads the whole file; later videos preload metadata only. Props: `src`, `videoId`, `projectIndex`, `poster`, `className`, `containerClassName`.

### `SocialLinks`

LinkedIn and GitHub icon links. `variant`: `header` · `footer` · `about` (default `footer`).

### `ScrollToTopButton`

Floating button that appears after scrolling down, shows scroll progress as a ring, and scrolls back to the top. Mounted once in `App.tsx`.

### `MonogramOverlap`

The overlapping "AA" monogram used in the navbar and footer. Takes `className`.

## Conventions

- Render dialogs through `Modal` so focus handling stays consistent.
- Every icon-only control needs an `aria-label`, and decorative icons get `aria-hidden="true"`.
- Respect `prefers-reduced-motion` for anything that animates or autoplays, as `VideoPlayer` does.
- When you add a shared component, export it from `src/components/index.ts`.
