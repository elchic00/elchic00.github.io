# Documentation Audit

Snapshot date: 2026-07-09

This is a backlog snapshot, not permanent operating guidance. Revalidate each item before acting because repository and external notes can change independently.

## Findings

- The external note `Projects/elchic00-chatbot.md` did not exist when this audit was recorded.
- The external `Home.md` linked to `Dev/Elchic00 Website/RAG-IMPLEMENTATION`, but that note was missing.
- The external `AI_CHAT.md` referenced the retired `src/data/portfolioContext.ts` path. Current sources are `src/data/context/{systemPrompt,biography,skills}.ts`, `src/data/context/index.ts`, and `public/knowledge/projects.json`.
- `docs/AI_CHAT.md` contained the same stale context path and should be checked against the current source-of-truth files.
- The repository and external image-optimization docs referenced old component paths such as `src/components/Travel.jsx`, `src/components/Projects.jsx`, and `src/content.js`. Current equivalents include `src/components/Travel/`, `src/components/Portfolio/Projects.tsx`, and `src/data/structured/trips.json`.
- The external `Home.md` said the RAG note was not yet written even though the repository contained `docs/RAG-IMPLEMENTATION.md`.
- The external `Projects/` directory mostly contained Hermes and job-search notes. `Projects/hermes-architecture.md` mentioned the chatbot as a supporting project but was not detailed website documentation.

External-note cleanup is out of scope for normal code changes. Perform it only when explicitly requested and after confirming the configured local mirror is available.
