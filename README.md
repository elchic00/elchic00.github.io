# Andrew Alagna

[Visit the site](https://elchic00.github.io) · [LinkedIn](https://www.linkedin.com/in/andrew-a-10b88215b/) · [GitHub](https://github.com/elchic00)

Hey, I’m Drew. I’m a New York software engineer with a BA in computer science—though I got there by way of business, chemistry, and construction first. That path left me with a bias for accessible, practical products, and for understanding the systems behind them, not just the UI in front of them. This repository powers my portfolio: professional work, personal projects, travel photos, and a few playful details because a portfolio should still feel like a person made it.

## What’s here

- A React and TypeScript portfolio focused on accessible, responsive frontend work.
- Project case studies for Hermes, local AI inference, Pi-Cloud, and the portfolio chat itself.
- A travel gallery, contact form, and a small Canvas Snake game.
- An AI chat assistant backed by a Cloudflare Worker and Gemini. It uses a compact, structured reference for the whole portfolio—no vector database where one is not needed.

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router
- **Services:** Cloudflare Workers, Gemini, EmailJS
- **Quality:** semantic HTML, keyboard-friendly interactions, DOMPurify, responsive media, and a small set of reusable components
- **Hosting:** GitHub Pages for the site; Cloudflare Workers for chat

## Run it locally

```bash
git clone https://github.com/elchic00/elchic00.github.io.git
cd elchic00.github.io
npm install
npm start
```

The site runs at [http://localhost:3000](http://localhost:3000).

To enable the contact form, copy `.env.example` to `.env.local` and add your EmailJS public values. The rest of the site works without them.

```bash
cp .env.example .env.local
```

The chat worker is optional for local UI work. To run it locally, set `GEMINI_API_KEY` as a Wrangler secret and use:

```bash
npm run worker:dev
```

## Useful commands

```bash
npm start             # Vite development server
npm run build         # TypeScript check, production build, critical CSS inlining
npm run preview       # Preview the production build
npm run worker:dev    # Run the Cloudflare Worker locally
npm run sync-context  # Sync AI context sources into worker/index.js
```

Deployment commands are intentionally not listed as everyday setup steps. They publish the site or worker and should be used deliberately.

## Where to look

- `src/pages/` and `src/components/` — routes and UI
- `src/data/structured/` — visible project, skill, and travel data
- `src/data/context/` + `public/knowledge/projects.json` — source material for the chat assistant
- `worker/index.js` — Cloudflare Worker for chat requests
- `docs/ARCHITECTURE.md` — current architecture and source-of-truth map
- `docs/AI_CHAT.md` — chat setup and behavior

## A note on reuse

This is a personal portfolio, not a starter template—but you’re welcome to look around, learn from it, or borrow an idea with attribution. If you build something inspired by it, I’d genuinely enjoy seeing it.

## Say hello

The best way to reach me is through the [contact form](https://elchic00.github.io/#contact), [LinkedIn](https://www.linkedin.com/in/andrew-a-10b88215b/), or the live site above.
