# Case-Study Pages — 2026-07-17

Promote the four project modals to real routes and add jobfit as a fifth project.
Decided with Drew: pages replace modals (old `?open=` deep links redirect), jobfit included,
work committed locally (manual deploy as always).

## Routes

| Path | Content source (Obsidian unless noted) |
|---|---|
| `/projects/hermes` | `Projects/hermes-architecture.md` + old HermesModal |
| `/projects/inference-engine` | `Projects/inference-architecture.md` + old InferenceModal |
| `/projects/pi-cloud` | `Projects/homelab-architecture.md` + old PiCloudModal |
| `/projects/elchic00-chatbot` | `Projects/elchic00-chatbot.md`, repo docs/AI_CHAT.md, RAG-IMPLEMENTATION.md + eval results |
| `/projects/jobfit` | `Projects/jobfit-architecture.md` + fde-skills-roadmap §2.2 war stories |

## Structure

- `src/pages/case-studies/CaseStudyLayout.tsx` — shared layout (+ `Section`, `Stat`, `Callout`).
- One page component per project under `src/pages/case-studies/`, lazy-loaded in `routes.tsx`.
- Project cards link to their case study; modals deleted after content lands.
- SPA deep links already handled by spa-github-pages (404.html).

## Content rules (applied by drafting agents)

- No internal IPs, hostnames, filesystem paths, usernames, cron/key names.
- Every number traceable to a source note; no invented metrics.
- Shape: problem → architecture → what broke & how it was debugged → results → honest limitations.

## Known limitation

Per-route OG preview cards don't work on a GH Pages SPA (crawlers don't run JS).
Deliberately out of scope; would need prerendering.
