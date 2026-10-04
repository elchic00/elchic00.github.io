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
- UI skills: `src/data/structured/skills.json`

The UI and AI project datasets are intentionally separate and are not identical. When project facts change, check both and update each one that should expose the change.

If an AI context source or `public/knowledge/projects.json` changes, run `npm run sync-context` and include the resulting `worker/index.js` diff.

## Public Claims

The site is recruiter-facing, and a wrong claim is worse than a missing one. The most common failure is a number or phrase that gets fixed in one place and left stale in the others.

- A project fact usually appears in several places: `src/data/structured/projects.json`, `src/components/About/FeaturedSystems.tsx`, other homepage components under `src/components/About/`, the case study in `src/pages/case-studies/`, the meta tags in `index.html`, the AI context under `src/data/context/`, and `public/knowledge/projects.json`, which is synced to `worker/index.js`. When you change a claim, grep the repo for the old value and fix every copy. If a copy is out of scope, flag it instead of leaving the site contradicting itself.
- A page's own copy is not the source for a number. Take figures from the owner's canonical project notes or a measurement, and quote the exact value. If you round, say which measurement you rounded.
- Never use internal employer product names, team names, or acronyms in public copy or chat context. Describe the feature by what it does for users. Keep this rule generic in `systemPrompt.ts`, because listing the banned terms makes the model repeat them.
- Match the case studies' plain register: say what broke and what was measured, and don't inflate counts, relationships, or scope.

## Commits and Deploys

- Every push to `main` deploys the site through `.github/workflows/deploy.yml`, so treat a push as publishing.
- The live chat changes only when the Worker is redeployed. After running `npm run sync-context`, say in your summary that a Worker deploy is still pending.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, and so on) with imperative subjects. Only write a body when the diff doesn't explain why the change was made. This repository is public, so don't add `Claude-Session:` trailers.

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
- AI chat UI or action-button changes:
  - `node scripts/test-chat-actions.mjs` (stubs the Worker; set `PUPPETEER_EXECUTABLE_PATH` if Puppeteer's bundled Chrome isn't installed)
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

Detailed per-area rules live in `.claude/rules/`. Claude Code auto-loads a rule when it reads a file the rule's `paths:` frontmatter matches; other agents should read the relevant file before working in that area:

- `.claude/rules/frontend.md` — `src/**` TypeScript, React, CSS, and structured data
- `.claude/rules/worker.md` — `worker/**`, `src/data/context/**`, project knowledge, sync script
- `.claude/rules/travel.md` — travel components, `trips.json`, travel images and tests
- `.claude/rules/documentation.md` — `docs/**` and any `.md` file

Repository references (read the one that matches the task; treat the code as the final authority if a doc disagrees):

- `docs/ARCHITECTURE.md` — surfaces, source-of-truth map, request flow, build/deploy
- `docs/AI_CHAT.md` — chat setup, context sources, deployment, troubleshooting
- `docs/COMPONENTS.md` — shared component behavior and patterns
- `docs/HOOKS.md` — custom hook APIs and usage
- `docs/IMAGE_OPTIMIZATION.md` — image pipeline and `npm run optimize-images`
- `docs/AI-CONTEXT-IMPLEMENTATION.md` — why the chat uses full-context prompting instead of retrieval

## Keeping This Guide Accurate

These instruction files are only useful while they match the code. When you work in an area and find that `AGENTS.md`, `CLAUDE.md`, a `.claude/rules/` file, or a `docs/` file is wrong, stale, or contradicts what you just saw (renamed path, removed file, changed behavior, hardcoded count that has drifted), fix it in the same change. If the correction is genuinely outside the current scope, note it in your summary instead of leaving it silently wrong. Prefer pointing at a source file over restating a volatile value.
