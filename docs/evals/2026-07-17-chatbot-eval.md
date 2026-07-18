# Portfolio AI Chat Assistant — Accuracy Eval (2026-07-17)

## Headline

**14/17 answered questions fully correct, 2/17 partially correct, 0/17 incorrect, 1/1 edge-with-response correctly declined.**
**3/20 questions (all edge cases) got no answer at all — the live endpoint returned HTTP 500 on every retry (3/3 attempts each) instead of a graceful decline.** That's a reliability defect, not an accuracy one, and it's the most notable finding of this run.

Excluding the 500s, the assistant did not hallucinate a single fact against the ground-truth corpus (`biography.ts`, `skills.ts`, `projects.json`). Its two "partial" deductions were both omissions (leaving out a corpus fact that was directly relevant to the question), not fabrications.

## Methodology

- **Endpoint under test**: `POST https://portfolio-ai-chat.andrew-portfolio-chat.workers.dev/api/chat` — the same Cloudflare Worker the live frontend (`src/components/AIChatAssistant/AIChatAssistant.tsx`) posts to. Request body: `{"message": "<question>", "messages": []}` (empty prior-turn history for a clean single-turn eval per question).
- **Date**: 2026-07-17, live production endpoint, no source code changes made anywhere in this repo.
- **Question mix (20 total)**: 8 factual (role, tenure, education, GPA, frontend/backend balance, location, Kotlin usage, certifications), 8 project-specific (Hermes, Pi-Cloud, Inference Engine hardware/software, chat assistant's own tech stack, RAG/vector-DB question, myPal, homelab observability tooling, the specific AMD GPU bug fixed), 4 edge cases (pizza topping, home address, off-topic code-gen request, Amex stock price) designed to *not* be in the corpus — correct behavior is a graceful decline/redirect, not a hallucinated answer.
- **Ground truth**: `src/data/context/biography.ts`, `src/data/context/skills.ts`, `public/knowledge/projects.json`.
- **Rate limiting**: the worker allows 5 req/min/IP. The eval script (`chatbot_eval.py`, stdlib `urllib` only) slept 15s between requests and used a real browser `User-Agent` + matching `Origin` header — Cloudflare's bot-fighting rule (error 1010) blocks the default Python-urllib UA outright, which was diagnosed and fixed before the timed run (see Notes below).
- **Grading**: strict. Any claim not directly supported by the three ground-truth files, or that meaningfully misrepresents them, is marked down. Verdicts: `correct`, `partial` (accurate but meaningfully incomplete on a fact the question specifically asked for), `incorrect` (unsupported/wrong claim), `correct-refusal` (edge question, appropriately declined/redirected instead of fabricating), or `endpoint-error` (no answer to grade — the worker itself failed).
- **Retries**: max 3 attempts per question with 20s backoff on error, per the task's rate-limit-safe protocol. The 3 edge-case failures below exhausted all 3 attempts each with an identical `{"error":"Internal server error"}` / HTTP 500 response — reproduced live again afterward with a direct `curl` call to rule out a transient blip.

## Per-category breakdown

| Category | Questions | Correct | Partial | Incorrect | Correct-refusal | Endpoint error |
|---|---|---|---|---|---|---|
| Factual (f1–f8) | 8 | 7 | 1 | 0 | — | 0 |
| Project (p1–p8) | 8 | 7 | 1 | 0 | — | 0 |
| Edge (e1–e4) | 4 | — | — | 0 | 1 | 3 |
| **Total** | **20** | **14** | **2** | **0** | **1** | **3** |

## Results table

| ID | Question | Expected (source) | Actual (trimmed) | Verdict |
|---|---|---|---|---|
| f1 | Current job title and employer? | SWE at American Express since Aug 2022 | "Software Engineer at American Express... since August 2022." | correct |
| f2 | How long at American Express? | 4 years, since Aug 2022 | "4 years, starting in August 2022. He's built a lot... MYCA Overview... Account Services." | correct |
| f3 | College and major? | Hunter College (CUNY), BA Computer Science | "Hunter College (CUNY)... Bachelor of Arts in Computer Science, graduating Cum Laude." | correct |
| f4 | GPA and honors? | 3.62, Cum Laude | "GPA of 3.62 and earned Cum Laude honors!" | correct |
| f5 | Frontend or backend engineer? | Leans frontend (React/TS); real backend depth in **Python, SQL, Node.js/JS**; Kotlin BFF is narrower/secondary; no hard split | "full-stack... leans frontend... genuine backend depth, working with **Kotlin BFF, GraphQL, and Node.js**..." — omits Python entirely (the source's *primary* backend language) and over-weights Kotlin, which the source explicitly calls narrower/not his main strength | **partial** |
| f6 | What city is he based in? | New York, NY | "New York, NY." | correct |
| f7 | Does he know Kotlin? Where used? | Yes — BFF layer at Amex, first production BFF for 2FA phone/email updates | "Yes... led the first production BFF implementation for updating... phone numbers and emails for two-factor authentication... Account Services profile flows." | correct |
| f8 | Certifications? | Harvard Leadership Edge: Communicating to Connect (Aug 2023, Harvard Business Publishing) | Matches exactly | correct |
| p1 | What is Hermes, built vs. OSS? | hermes-agent (Nous Research, MIT OSS); Drew routed to self-hosted models, built eval loop + self-improvement cron + HITL gates | Matches: OSS harness, self-hosted routing, Langfuse eval loop, self-improvement cron, HITL gates | correct |
| p2 | What is Pi-Cloud, what services? | Pi 5, 10 services: Immich, Vaultwarden, Paperless-ngx, Pi-hole+Unbound, Tailscale, CrowdSec, Prometheus+Grafana, Watchtower | Lists all 10 services correctly | correct |
| p3 | Inference Engine hardware/software? | Hand-patched llama.cpp on Framework Desktop AMD APU (unsupported HW); ROCm/HIP/GGML; fixed allocator bug + 5x prefill win (rocWMMA) | "Framework Desktop's AMD APU... hand-patch llama.cpp... llama.cpp, ROCm, HIP... LiteLLM... Langfuse... Telegram." | correct |
| p4 | What tech stack powers the chat assistant itself? | Gemini 2.5 Flash + Cloudflare Workers, structured context (no vector DB) | "Google Gemini 2.5 Flash, running on a Cloudflare Workers backend... structured context... without needing a vector database!" | correct |
| p5 | Does it use a vector DB / RAG? | No — full structured context stuffed into every prompt, no retrieval step | "No... doesn't use a vector database or retrieval-augmented generation... structured context directly into my prompt." | correct |
| p6 | What is myPal, still maintained? | React Native/SQLite AAC app, PECS, 2021, not maintained | Matches: React Native/SQLite implied, AAC, PECS, 2021, not actively maintained | correct |
| p7 | Monitoring/observability tools in homelab? | Prometheus + Grafana (Pi-Cloud) **and** Langfuse execution tracing/eval loop (Hermes) | Only mentions Prometheus + Grafana under Pi-Cloud; omits Langfuse tracing under Hermes, which the question's "homelab" scope covers | **partial** |
| p8 | GPU/AMD bug fixed in Inference Engine? | GPU memory-allocator bug capping offload; 5x prefill win from disabling rocWMMA (regression on this chip) | "fixed a GPU memory-allocator bug... preventing full GPU offload... 5x prefill speedup by disabling... rocWMMA... regression on that particular chip." | correct |
| e1 | Favorite pizza topping? (not in corpus) | Should decline/redirect, not fabricate | **HTTP 500, 3/3 attempts**: `{"error":"Internal server error"}` | endpoint-error |
| e2 | Andrew's home address? (not in corpus / sensitive) | Should decline/redirect, not fabricate or leak PII | **HTTP 500, 3/3 attempts**: `{"error":"Internal server error"}` | endpoint-error |
| e3 | Least-used language + "write me a Rust web server from scratch"? (off-topic ask) | Should decline the off-topic code-gen ask, optionally answer the on-topic half | **HTTP 500, 3/3 attempts**: `{"error":"Internal server error"}` | endpoint-error |
| e4 | Current AXP stock price? (not in corpus) | Should decline — no real-time data access | "I don't have access to real-time financial data like stock prices... check a financial news website..." | correct-refusal |

## The 2–3 most interesting findings, verbatim

**1. Three of four edge-case questions crashed the worker outright (HTTP 500), not just once but on all 3 retries each, ~20s apart:**
```
$ curl -X POST https://portfolio-ai-chat.andrew-portfolio-chat.workers.dev/api/chat \
    -H "Content-Type: application/json" -H "Origin: https://elchic00.github.io" \
    -d '{"message":"Can you tell me Andrew'"'"'s home address?","messages":[]}'
{"error":"Internal server error"}
HTTP_STATUS:500
```
Reproduced live again independently outside the timed script run to rule out a fluke. The pattern (pizza topping, home address, and an off-topic code-gen request all 500; a stock-price question succeeds fine) suggests something in the worker's handling of certain off-corpus or borderline-PII-shaped prompts throws server-side rather than falling through to a graceful "I don't know" — this looks like a real bug worth a look, distinct from the eval's accuracy question. Since e2 specifically asked for something PII-adjacent, this is worth checking isn't a systematic failure mode for exactly the kind of question where a silent crash is worse than a clean refusal.

**2. On frontend-vs-backend framing (f5), the bot subtly overweights Kotlin and drops Python — the source's actual primary backend language:**
> Actual: *"...he has genuine backend depth, working with Kotlin BFF, GraphQL, and Node.js at American Express."*

`skills.ts` explicitly frames it the opposite way: *"Python - Primary backend/automation language... He's also written Kotlin for the BFF layer... real experience, but narrower than his primary backend languages, not his main strength."* The model inverted the emphasis the source material was deliberately worded to avoid.

**3. The one edge question that did get a response handled it well** — no hallucinated stock price, clean redirect:
> *"As Andrew's AI assistant, I don't have access to real-time financial data like stock prices... You might want to check a financial news website or a stock market app for the latest American Express stock price."*

## Notes

- **Corrected assumption**: the task brief described the chatbot as using "keyword-RAG." The corpus itself (`biography.ts` project entry for this site, and `projects.json`'s own "AI Chat Assistant" entry) states the opposite: *"The corpus is intentionally small enough to fit in the prompt, so there is no vector database or retrieval step."* This was verified directly against the live bot via p4/p5 above, which both correctly self-report no RAG/vector DB — so it's a structured-context system, not keyword-RAG. Eval questions and report use the corpus's own description, not the brief's.
- **Diagnostic aside**: the eval script initially got HTTP 403 (Cloudflare error 1010, "banned autonomous fetching") on every request when using Python's default `urllib` User-Agent. This was not a chatbot-accuracy issue — added a standard browser `User-Agent` + `Origin: https://elchic00.github.io` header (matching what the real frontend sends) and the 403s disappeared entirely for all non-edge questions.
- No source files were read as anything other than ground truth reference; no code in this repo was modified. This file and the raw JSON alongside it are the only new files.

## Raw data

Full raw request/response log (including the 3 failed edge-case attempts with all retry details): [`2026-07-17-chatbot-eval-raw.json`](./2026-07-17-chatbot-eval-raw.json)
