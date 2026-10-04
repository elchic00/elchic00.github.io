# AI Chat Assistant

The chat in the corner of every page answers questions about Andrew's work, projects, and background. The browser posts to a Cloudflare Worker, and the Worker adds the portfolio context and calls Gemini, so the API key never reaches the frontend.

```
Browser ──POST /api/chat──► Cloudflare Worker ──► Gemini API
        ◄── { response } ──                   ◄──
```

Current values live in source, not here: the model and generation settings in `worker/index.js` (`GEMINI_API_URL`, `generationConfig`), the rate limit in `RATE_LIMIT` and `RATE_LIMIT_WINDOW`, and the endpoint the frontend calls in `src/components/AIChatAssistant/AIChatAssistant.tsx`.

## Files

```
src/components/AIChatAssistant/
├── AIChatAssistant.tsx    # Toggle button, message state, request/response handling
├── ChatWindow.tsx         # Chat dialog: layout, outside-click close, focus
├── ChatHeader.tsx         # Title, clear and close buttons
├── ChatMessage.tsx        # One message, its action buttons and "Show me on the page"
├── ChatInput.tsx          # Text input
├── SuggestedQuestions.tsx # Starter questions shown on first open
├── QuickActions.tsx       # Navigation chips
├── LoadingIndicator.tsx   # Typing indicator
├── PageSpotlight.tsx      # Highlights the homepage element a reply points at
├── markdownRenderer.ts    # marked + DOMPurify rendering (lazy, chat-only)
├── useStreamingText.ts    # Word-by-word reveal of a reply
├── types.ts               # Message type, ACTION_CONFIGS, SHOW_TARGETS, SUGGESTED_QUESTIONS
├── utils.ts               # Marker parsing, keyword fallbacks, action handling
└── index.ts               # Barrel export

src/data/context/          # systemPrompt.ts, biography.ts, skills.ts (context sources)
public/knowledge/projects.json  # Compact project reference sheet sent on every request
scripts/sync-portfolio-context.js  # Copies the sources into worker/index.js
worker/index.js            # Worker logic plus generated context
```

## How a request works

1. `AIChatAssistant` posts `{ message, messages }`: the new message plus the stored conversation.
2. The Worker answers `OPTIONS` for CORS (it allows any origin), rejects non-`POST` requests, and returns `500 Server configuration error` when the `GEMINI_API_KEY` secret is missing.
3. It rate-limits by `CF-Connecting-IP`. The counts live in an in-memory `Map`, so the limit applies per Worker isolate and is best-effort rather than global.
4. It builds the prompt from the synchronized portfolio context, every record in the project reference sheet, and a short window of recent messages (greeting messages are dropped). There is no retrieval step; see `docs/AI-CONTEXT-IMPLEMENTATION.md` for why.
5. It returns `{ response }`, or a friendly fallback when Gemini returns no candidates or stops for safety.
6. The frontend strips the markers described below, renders the reply as sanitized Markdown, and reveals it word by word.

## Action buttons

The prompt asks the model to end every reply with `[ACTIONS: view_resume, contact_form]`. The frontend strips the tag (including a backtick-wrapped or cut-off one), keeps only names that exist in `ACTION_CONFIGS` in `types.ts`, and falls back to keyword detection on the question when none remain. `handleAction` in `utils.ts` defines what each action does.

## Page spotlight

A reply about one homepage item can carry `[SHOW: target]` before its ACTIONS line. The frontend strips the tag, keeps it only if the id is in `SHOW_TARGETS` (`types.ts`), and renders a "Show me on the page" button. Each id matches a `data-chat-target` attribute on the page.

- On desktop, a model-chosen tag spotlights the element as soon as the reply finishes streaming, if it's on the current page. The chat slides aside until the next click, scroll, touch, or key press.
- A keyword match on the question (`detectShowFromQuestion`) only offers the button.
- On mobile, the button closes the chat first, since the chat covers the page.
- From another route, the button loads `/?show=<target>`; `PageSpotlight` reads and removes the parameter, then spotlights and focuses the element.

To add a target, add the id and caption to `SHOW_TARGETS`, put `data-chat-target` on the element, list it in the Page Spotlight section of `systemPrompt.ts`, and run `npm run sync-context`.

Deploy order matters when the frontend learns a new marker: push the site first, then deploy the Worker. A Worker whose prompt emits a marker the live frontend doesn't strip shows the raw tag to visitors.

## Changing the chat

| Change | Edit | Then |
| --- | --- | --- |
| What the assistant knows or how it behaves | `src/data/context/*.ts` or `public/knowledge/projects.json` | `npm run sync-context`, review the `worker/index.js` diff, `npm run build`, deploy the Worker |
| Worker logic | Handwritten parts of `worker/index.js` | Test with `npm run worker:dev`, deploy the Worker |
| Chat UI | `src/components/AIChatAssistant/` | `npm run build`, `node scripts/test-chat-actions.mjs`, push to `main` |
| Suggested questions | `SUGGESTED_QUESTIONS` in `types.ts` | Push to `main` |

Never hand-edit the generated context sections of `worker/index.js`. Deploying the site and the Worker both need explicit authorization; see `AGENTS.md`.

## Setup and deployment

```bash
npx wrangler login
npx wrangler secret put GEMINI_API_KEY   # paste the key; it is stored as a Cloudflare secret
npm run worker:deploy                    # runs sync-context, then wrangler deploy
```

The site itself deploys when `main` is pushed (`.github/workflows/deploy.yml`).

## Local development

```bash
npm start            # site at http://localhost:3000
npm run worker:dev   # Worker at http://localhost:8787
```

The frontend's endpoint is hardcoded to the deployed Worker in `AIChatAssistant.tsx`, so local UI work talks to production. To exercise a local Worker, point that URL at `http://localhost:8787/api/chat` temporarily and don't commit the change. A local Worker needs the key in `.dev.vars`, which is gitignored.

## Testing

`node scripts/test-chat-actions.mjs` starts Vite, stubs the Worker, and checks marker parsing, every action button, and the page spotlight on desktop, mobile, and cross-page. If Puppeteer's bundled Chrome isn't installed, set `PUPPETEER_EXECUTABLE_PATH` to a local Chrome.

To check what the live model emits, post to the deployed endpoint:

```bash
curl -s -X POST https://portfolio-ai-chat.andrew-portfolio-chat.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How fast is his local model?", "messages": []}'
```

## Troubleshooting

- **`500 Server configuration error`:** the `GEMINI_API_KEY` secret is missing. Check with `npx wrangler secret list` and set it with `npx wrangler secret put GEMINI_API_KEY`.
- **`429 Rate limit exceeded`:** wait for the window in `RATE_LIMIT_WINDOW` to pass.
- **The chat answers with old facts:** the context sources changed without a sync and Worker deploy. Run `npm run worker:deploy`, which syncs first.
- **Gemini errors or truncated replies:** stream the Worker's logs with `npx wrangler tail`. The Worker logs Gemini error bodies and any early `finishReason`.
- **A raw `[SHOW: …]` or `[ACTIONS: …]` tag appears in a reply:** the deployed frontend is older than the Worker's prompt. Push the site.
