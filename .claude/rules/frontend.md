---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "src/**/*.css"
  - "src/data/structured/**"
---

# Frontend Rules

- Prefer existing components in `src/components/shared/` before adding one-off UI.
- Use `Modal` for portal-rendered dialogs and `ConfirmDialog` instead of native `confirm()`.
- Use `Button`, `ImageWithLoader`, and `VideoPlayer` when their existing behavior fits.
- Keep barrel exports current when adding shared or feature components.
- Match the existing mobile-first Tailwind style, semantic HTML, focus behavior, keyboard support, and reduced-motion handling.
- Use the existing `ToastProvider` and `ToastContainer` rather than local notification systems.
- Preserve lazy image loading and meaningful alt text.

## Portfolio Data

- Visible projects live in `src/data/structured/projects.json`; project media belongs under `public/images/projects/`.
- If chat should know a project fact, update `public/knowledge/projects.json` as well.
- If a project changes the broader portfolio narrative, update the relevant source under `src/data/context/` and run `npm run sync-context`.
- UI skill categories live in `src/data/structured/skills.json`; tooltip copy lives in `skillTooltips.ts`; AI skill context lives in `src/data/context/skills.ts`.

## Failure Boundaries

Handle realistic failures around EmailJS, browser and storage APIs, network requests, JSON parsing, and user input. Do not add speculative handling for states prevented by established application invariants.
