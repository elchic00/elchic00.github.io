# AI Context Implementation Summary

The portfolio chat uses a small, structured prompt context rather than a retrieval pipeline. The project records (see `public/knowledge/projects.json` for the current set) fit comfortably in the request alongside the portfolio context, so the Cloudflare Worker sends the complete reference sheet to Gemini on every request.

## Why this design fits

- **Reliable follow-ups:** a visitor can say “tell me more about that” without relying on the latest message matching a keyword.
- **Auditable behavior:** every project fact available to the model is in one concise, reviewable reference sheet.
- **No unnecessary infrastructure:** there is no embedding model, vector store, ranking heuristic, or additional network hop for this static corpus.

## Key files

- `public/knowledge/projects.json` – source project reference sheet.
- `src/data/context/` – source system prompt, biography, and skills context.
- `scripts/sync-portfolio-context.js` – synchronizes those sources into the Worker.
- `worker/index.js` – rate limits requests, validates input, combines context and chat history, then calls Gemini.

If the corpus grows into many project write-ups, articles, or documents, evaluate lexical retrieval first and add a retrieval layer only when tests show that complete-context prompting is no longer sufficient.
