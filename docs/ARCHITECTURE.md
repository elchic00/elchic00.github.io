# Architecture

This portfolio has two deployable surfaces: a static React application hosted on GitHub Pages and a Cloudflare Worker that serves the AI chat API.

Treat `package.json`, `wrangler.toml`, and `worker/index.js` as the source of truth for current versions, bindings, environment names, and model configuration.

## Frontend

- `src/index.tsx` creates the React root and wraps the app in `BrowserRouter`.
- `src/App.tsx` owns the global layout, route content, navigation, footer, AI chat, toasts, error boundary, analytics, and hash scrolling.
- `src/routes.tsx` defines `/`, `/projects`, one `/projects/<id>` route per case study, `/travel`, and `/snake`; the case studies, Travel, and Snake are lazy-loaded, and `usePrefetchRoutes` warms their chunks once the browser is idle.
- `src/constants/app.ts` owns EmailJS environment validation and shared contact/resume constants.
- `src/index.css` contains Tailwind and global styles.

Major feature areas:

- `src/pages/`: the home and projects pages, and the case studies under `src/pages/case-studies/`.
- `src/components/About/`: skills, experience, accessibility, and featured systems.
- `src/components/Portfolio/` and `src/components/Projects/`: project presentation and project-specific modals.
- `src/components/Travel/`: trip navigation, cards, galleries, lightbox, and layout helpers.
- `src/components/Contact/` and `src/hooks/useContactForm.ts`: EmailJS submission, validation, draft persistence, templates, and mailto fallback.
- `src/components/Snake.tsx` and `src/hooks/useSnakeGame.ts`: canvas Snake game.
- `src/components/shared/`: reusable modal, dialog, toast, button, media, logo, image, and social primitives.

## Data Model

Visible portfolio data:

- `src/data/structured/projects.json`: project cards, media, links, IDs, and technologies.
- `src/data/structured/skills.json`: displayed skill categories.
- `src/data/structured/trips.json`: trip metadata, photo URLs, alt text, and captions.
- `src/data/structured/nightShift.json`: scheduled homelab jobs for the homepage night-shift dial, with their times and the machines each one uses. Unverified times render only in dev.
- `src/data/structured/messageTemplates.json`: contact-form quick-fill templates.

AI data:

- `src/data/context/biography.ts`: biography, work history, project narrative, travel, contact, and soft skills.
- `src/data/context/skills.ts`: technical skills narrative.
- `src/data/context/systemPrompt.ts`: assistant behavior, tone, response rules, and action markers.
- `src/data/context/index.ts`: combined context export.
- `public/knowledge/projects.json`: compact project reference sheet for the AI chat. It is intentionally separate from the UI project dataset.

## AI Chat Request Flow

1. `src/App.tsx` renders `AIChatAssistant` globally.
2. `src/components/AIChatAssistant/` owns UI state, suggested questions, sanitized Markdown rendering, and the action and page-spotlight markers (see `docs/AI_CHAT.md`).
3. The frontend POSTs conversation data to the Worker's `/api/chat` endpoint.
4. `worker/index.js` handles CORS, validates the method and JSON payload, applies IP-based rate limiting, and constructs the Gemini request.
5. The Worker injects synchronized portfolio context, recent conversation history, and the complete compact project reference sheet.
6. The Worker returns a JSON response or a structured error.

The project corpus is a handful of concise records, so the Worker sends all of them rather than ranking a partial subset. This keeps follow-up questions grounded and makes the behavior auditable without a vector database or retrieval layer. Only response generation requires the external model API. `public/knowledge/projects.json` is the source of truth for the count.

## Context Synchronization

The source context files and `public/knowledge/projects.json` are copied into generated sections of `worker/index.js` by `scripts/sync-portfolio-context.js`.

Run:

```bash
npm run sync-context
```

Review the resulting Worker diff whenever a context source changes. Handwritten Worker logic may be edited directly; generated context must be changed at its source.

## Build and Deployment

- `npm run build` runs TypeScript, Vite, and `scripts/inline-critical-css.js`; Vite emits the static site to `build/`.
- Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it as a GitHub Pages deployment. That is what serves the live site.
- `npm run deploy` (with `predeploy`) still publishes `build/` to the `gh-pages` branch, but the live site does not come from that branch. Don't use it.
- `npm run worker:deploy` synchronizes context and deploys the Worker with Wrangler.

Deployment and publishing require explicit user authorization.

## Environment Boundaries

The contact form reads the public Vite variables documented in `.env.example`. Local values belong in `.env.local`; never commit or print them.

The Worker reads `GEMINI_API_KEY` from Cloudflare secrets. It is not a Vite environment variable and must never enter the repository.
