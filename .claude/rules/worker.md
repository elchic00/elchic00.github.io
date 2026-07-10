---
paths:
  - "worker/**"
  - "src/data/context/**"
  - "public/knowledge/projects.json"
  - "scripts/sync-portfolio-context.js"
  - "wrangler.toml"
---

# Worker and AI Context Rules

- The frontend POSTs chat requests to the Worker at `/api/chat`; the Worker owns CORS, method and payload validation, rate limiting, context selection, and the Gemini request.
- `public/knowledge/projects.json` supplies deterministic keyword retrieval. Keep retrieval behavior deterministic unless the task explicitly changes the architecture.
- Source context lives in `src/data/context/systemPrompt.ts`, `biography.ts`, and `skills.ts`.
- `worker/index.js` contains both handwritten Worker logic and generated context. Edit handwritten logic when required, but never hand-edit synchronized context.
- After changing AI context or project knowledge, run `npm run sync-context`, inspect the generated `worker/index.js` diff, and run `npm run build`.
- Test handwritten Worker changes locally with `npm run worker:dev`.
- Never expose `GEMINI_API_KEY` or other Worker secrets, and never deploy without explicit authorization.
- Use `package.json`, `wrangler.toml`, and `worker/index.js` for current runtime, binding, and model details instead of copying volatile values into instructions.
