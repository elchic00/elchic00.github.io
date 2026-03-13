# RAG Implementation Summary

This project includes a lightweight **Retrieval-Augmented Generation (RAG)** capability baked into the AI chat assistant. Rather than relying on large vector stores or third-party embedding services, the system uses a simple keyword-based similarity score over a curated set of project descriptions.

## ✅ What’s Included

- **Project-aware responses**: When a user asks about a project, the worker finds the most relevant projects and injects their details into the AI prompt.
- **Fast, offline-friendly**: No external embedding service required; the matching logic runs entirely in the Cloudflare Worker.
- **Easily updatable**: Update the knowledge base by editing JSON/TS files and re-syncing the worker.

---

## 📁 Key Files (Current Implementation)

- `worker/index.js` – Cloudflare Worker that receives chat requests, performs keyword matching, and calls Gemini.
- `public/knowledge/projects.json` – Project data used for retrieval.
- `src/data/context/*` – System prompt content (`systemPrompt.ts`, `biography.ts`, `skills.ts`).
- `scripts/sync-portfolio-context.js` – Builds the Worker context by combining system prompts + project data.

---

## 🚀 Updating the Knowledge Base

### 1) Edit project or context data
- Update project summaries in `public/knowledge/projects.json`
- Edit the system prompt / biography / skills in `src/data/context/`

### 2) Sync to the worker
Run:

```bash
npm run sync-context
```

This updates `worker/index.js` in-place with the latest context and project data.

### 3) Deploy the worker

```bash
npm run worker:deploy
```

---

## 🧠 How Retrieval Works (High Level)

1. The worker parses the incoming chat message.
2. It scores each project from `public/knowledge/projects.json` against the message using keyword matching.
3. The top projects are formatted into a brief “Relevant Projects” context string.
4. That context is appended to the system prompt before calling Gemini.

This means the assistant can answer questions like:
- “Tell me about the myPal project”
- “What stack did you use for Invent0ry?”
- “How do you approach accessibility in your work?”

---

## 🛠️ Notes

- No special API keys are needed for retrieval (only Gemini API key for generation).
- The keyword matching is intentionally lightweight and deterministic for reliability.
- You can extend the system by adding more projects or enhancing the scoring logic in `worker/index.js`.
