# AGENTS.md

Project-specific operating guide for `elchic00.github.io`, Andrew Alagna's React/TypeScript portfolio.

## Project

This repository has two separately deployable surfaces:

1. A Vite React/TypeScript single-page portfolio hosted on GitHub Pages.
2. A Cloudflare Worker at `/api/chat` that supplies portfolio context to Gemini.

Treat `package.json`, `wrangler.toml`, and `worker/index.js` as the source of truth for current versions, bindings, and model configuration.

## Non-Negotiable Rules

- Do not run `npm run deploy`, `npm run worker:deploy`, `wrangler deploy`, push commits, or publish anything unless explicitly requested.
- Inspect `git status` and existing diffs before editing. Preserve unrelated and uncommitted user changes.
- Never commit or print secrets, `.env.local`, API keys, or credentials.
- Do not hand-edit synchronized portfolio context in `worker/index.js`. Handwritten Worker logic may be edited when required, but synchronized content must be changed through its source files and regenerated with `npm run sync-context`.
- Do not perform unrelated refactors or documentation cleanup.
- Ask only when ambiguity materially affects correctness, user-visible behavior, security, or a destructive action. Otherwise inspect the repository, make the smallest reversible assumption, state it briefly, and proceed.

## Common Commands

```bash
npm install              # install dependencies
npm start                # Vite dev server at http://localhost:3000
npm run build            # TypeScript, Vite build, and critical CSS inlining
npm run preview          # preview the production build
npm run worker:dev       # local Cloudflare Worker at http://localhost:8787
npm run sync-context     # regenerate synchronized context in worker/index.js
```

Deployment commands intentionally are not part of the normal workflow; see the non-negotiable rules above.

## Architecture

The frontend renders the global AI chat, which POSTs to the Cloudflare Worker. The Worker validates and rate-limits requests, adds the complete compact project reference sheet plus recent conversation history, and calls Gemini. The corpus is intentionally small enough that it does not need a retrieval or vector-search layer.

Detailed architecture, component ownership, build behavior, and deployment surfaces are documented in `docs/ARCHITECTURE.md`. AI-specific implementation details are in `docs/AI_CHAT.md` and `docs/AI-CONTEXT-IMPLEMENTATION.md`.

## Sources of Truth

- UI project cards: `src/data/structured/projects.json`
- AI project reference sheet: `public/knowledge/projects.json`
- AI context sources: `src/data/context/systemPrompt.ts`, `biography.ts`, and `skills.ts`
- Combined context export: `src/data/context/index.ts`
- Generated/deployed context destination: `worker/index.js`
- Context sync script: `scripts/sync-portfolio-context.js`
- Travel data: `src/data/structured/trips.json`
- UI skills: `src/data/structured/skills.json` and `skillTooltips.ts`

The UI and AI project datasets are intentionally separate and are not identical. When project facts change, check both and update each one that should expose the change.

If an AI context source or `public/knowledge/projects.json` changes, run `npm run sync-context` and include the resulting `worker/index.js` diff.

## Change Discipline

- Make the smallest change that fully satisfies the request.
- Match existing patterns before introducing new abstractions.
- Do not refactor unrelated code.
- Remove only imports, variables, functions, or files made unused by the current change.
- Add error handling at real trust and failure boundaries: user input, network calls, browser APIs, storage, JSON parsing, and third-party services. Avoid speculative branches for states that application invariants already prevent.
- Define how the result will be verified before implementation.

## Verification

Run the smallest relevant checks below. For code changes, also run `npm run build`.

- TypeScript or React changes: `npm run build`
- Travel gallery or layout changes:
  - `node scripts/gallery-layout.test.mjs`
  - `node scripts/test-travel-hash-sync.mjs`
  - `node scripts/test-travel-lightbox-a11y.mjs`
- AI context or project-knowledge changes:
  - `npm run sync-context`
  - inspect the resulting `worker/index.js` diff
  - `npm run build`
- Worker logic changes:
  - test locally with `npm run worker:dev`
  - `npm run build`
  - do not deploy unless explicitly requested
- Documentation-only changes: no build unless executable examples or referenced paths changed in a way that requires verification.

Before finishing:

- Review `git diff`.
- Confirm no unrelated files were changed.
- Report commands run and any relevant checks not run.

## Scoped Rules and References

Detailed per-area rules live in `.claude/rules/`. Claude Code auto-loads them by path; other agents should read the relevant file before working in that area:

- `.claude/rules/frontend.md`
- `.claude/rules/worker.md`
- `.claude/rules/travel.md`
- `.claude/rules/documentation.md`

Repository references:

- `docs/ARCHITECTURE.md`
- `docs/AI_CHAT.md`
- `docs/COMPONENTS.md`
- `docs/HOOKS.md`
- `docs/IMAGE_OPTIMIZATION.md`
- `docs/AI-CONTEXT-IMPLEMENTATION.md`
- `docs/DOCUMENTATION_AUDIT.md`
