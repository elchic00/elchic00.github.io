# 🤖 AI Chat Assistant - Complete Guide

## Overview

Your portfolio features a free, high-quality AI chat assistant powered by **Google Gemini 2.5 Flash** and **Cloudflare Workers**. Visitors can ask questions about your experience, projects, skills, and travel adventures.

### Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Visitor   │ ───► │ Cloudflare Worker│ ───► │   Gemini    │
│   Browser   │ ◄─── │   (API Proxy)    │ ◄─── │     API     │
└─────────────┘      └──────────────────┘      └─────────────┘
```

**Benefits:**
- ✅ API key never exposed to frontend (secure)
- ✅ Rate limiting prevents abuse (5 req/min per IP)
- ✅ Free tier: 1,500 requests/day (Gemini) + 100K requests/day (Cloudflare)
- ✅ Serverless - no backend maintenance

---

## 📁 File Structure

The AI chat has been **refactored** into modular components:

```
src/components/AIChatAssistant/
├── AIChatAssistant.tsx      # Main component (160 lines)
├── ChatWindow.tsx            # Chat container
├── ChatHeader.tsx            # Header with controls
├── ChatMessage.tsx           # Individual messages
├── ChatInput.tsx             # User input field
├── SuggestedQuestions.tsx    # Quick question buttons
├── LoadingIndicator.tsx      # Typing animation
├── types.ts                  # Shared TypeScript types
├── utils.ts                  # Utility functions (markdown, actions)
└── index.ts                  # Barrel export

src/data/
└── portfolioContext.ts       # AI knowledge base (600+ lines)

worker/
└── index.js                  # Cloudflare Worker API

scripts/
└── sync-portfolio-context.js # Keeps context in sync
```

---

## ✨ Features

### Core Features
- **Conversational Memory** - Remembers last 8 messages for context
- **Markdown Rendering** - Rich formatting with `marked` library
- **Sanitization** - XSS protection with `DOMPurify`
- **Action Buttons** - Navigate to sections, download resume, open LinkedIn
- **Rate Limiting** - 5 requests/minute per IP
- **Error Handling** - Retry on failure, clear chat option
- **Mobile Responsive** - Smooth animations, works on all devices

### Advanced Features
- **Suggested Questions** - 4 preset questions on first open
- **Pre-fill Contact Form** - "Ask directly" action pre-fills your question
- **Lazy Loading** - Markdown library loaded only when chat opens
- **Loading States** - Typing indicator with bouncing dots
- **Clear Chat** - Reset conversation with one click

---

## 🚀 Setup & Deployment

### Prerequisites

1. **Cloudflare Account** (free) - [Sign up](https://dash.cloudflare.com/sign-up)
2. **Google Gemini API Key** (free) - [Get key](https://aistudio.google.com/app/apikey)

### Step 1: Install Dependencies

Already included in `package.json`:

```bash
npm install
```

### Step 2: Login to Cloudflare

```bash
npx wrangler login
```

This opens a browser to authenticate.

### Step 3: Set API Key as Secret

**IMPORTANT**: Never commit API keys to Git!

```bash
npx wrangler secret put GEMINI_API_KEY
# Paste your Gemini API key when prompted
```

This stores the key securely in Cloudflare's environment.

### Step 4: Deploy Worker

```bash
npm run worker:deploy
```

This will:
1. Sync portfolio context (via `sync-portfolio-context.js`)
2. Deploy worker to Cloudflare
3. Output a URL like: `https://portfolio-ai-chat.YOUR-USERNAME.workers.dev`

**Worker is now live!** The React component is already configured to use the correct URL.

### Step 5: Deploy Main Site

```bash
npm run deploy
```

---

## 🔧 Configuration

### Portfolio Context

The AI's knowledge comes from [src/data/portfolioContext.ts](../src/data/portfolioContext.ts):

```typescript
export const PORTFOLIO_CONTEXT = `
You are Andrew Alagna's AI assistant...

# About Andrew
- Full Name: Andrew Alagna
- Contact: New York, NY
...
`;
```

**To update:**
1. Edit `src/data/portfolioContext.ts`
2. Run `npm run sync-context` (or deploy worker)
3. Context automatically syncs to `worker/index.js`

### Rate Limiting

Adjust in [worker/index.js](../worker/index.js):

```javascript
const RATE_LIMIT = 5;              // requests per minute
const RATE_LIMIT_WINDOW = 60000;   // 1 minute in milliseconds
```

### AI Temperature

Control creativity in [worker/index.js](../worker/index.js):

```javascript
generationConfig: {
  temperature: 0.7,        // 0 = focused, 1 = creative
  maxOutputTokens: 1100,   // Max response length
  topP: 0.8,
  topK: 40,
}
```

### Action Buttons

When the AI includes `[ACTIONS: view_resume, contact_form]` in responses, buttons appear automatically.

**Available Actions** (in [types.ts](../src/components/AIChatAssistant/types.ts)):
- `view_resume` - Opens PDF resume
- `view_linkedin` - Opens LinkedIn profile
- `view_github` - Opens GitHub profile
- `contact_form` - Scrolls to contact section
- `ask_directly` - Pre-fills contact form with chat message
- `view_projects` - Scrolls to projects
- `view_travel` - Opens travel gallery
- `view_experience` - Scrolls to experience
- `send_email` - Opens email client

---

## 📊 Usage Limits & Monitoring

### Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| **Gemini API** | 15 req/min<br>1,500 req/day | Plenty for portfolio traffic |
| **Cloudflare Workers** | 100,000 req/day | Way more than needed |
| **Rate Limit (Custom)** | 5 req/min per IP | Prevents spam/abuse |

### Monitor Usage

**Cloudflare Dashboard:**
```bash
# View real-time logs
npx wrangler tail

# Or visit: https://dash.cloudflare.com/
```

**Gemini API:**
- Visit: https://aistudio.google.com/
- Check quota usage in API dashboard

---

## 🎨 Customization

### Change Chat Appearance

Edit [AIChatAssistant.tsx](../src/components/AIChatAssistant/AIChatAssistant.tsx):

```typescript
// Chat button gradient
className="bg-gradient-to-r from-cyan-500 to-purple-600"

// Chat window size
className="w-96 max-w-[calc(100vw-3rem)] sm:h-[500px]"
```

### Modify Suggested Questions

Edit [types.ts](../src/components/AIChatAssistant/types.ts):

```typescript
export const SUGGESTED_QUESTIONS = [
  "What are Andrew's main technical skills?",
  "Tell me about his teaching experience",
  "What projects has he built?",
  "Where has Andrew traveled?",
];
```

### Update AI Personality

Edit the system prompt in [portfolioContext.ts](../src/data/portfolioContext.ts):

```typescript
# Instructions for Responses

## General Tone & Style
- Be conversational, warm, and professional
- Show enthusiasm but stay authentic
- Keep responses concise (2-4 sentences typically)
```

---

## 🐛 Troubleshooting

### Chat Button Shows But Doesn't Respond

**Check:**
1. Browser console for errors (F12)
2. Worker URL is correct (already configured)
3. Worker is deployed: `npm run worker:deploy`
4. API key is set: `npx wrangler secret list`

**Test worker directly:**
```bash
curl -X POST https://portfolio-ai-chat.YOUR-USERNAME.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

### "Rate Limit Exceeded"

**Solution:** Wait 60 seconds. Rate limit is 5 requests/minute per IP.

**Adjust:** Edit `RATE_LIMIT` in [worker/index.js](../worker/index.js) if needed.

### Worker Deployment Fails

**Common Issues:**
- Not logged in: Run `npx wrangler login`
- Invalid `wrangler.toml`: Check syntax
- Network error: Try again

**View detailed logs:**
```bash
npx wrangler deploy --dry-run
```

### "GEMINI_API_KEY environment variable is not set"

**Solution:**
```bash
npx wrangler secret put GEMINI_API_KEY
# Paste your API key
```

**Verify:**
```bash
npx wrangler secret list
```

### Context Out of Sync

If you updated [portfolioContext.ts](../src/data/portfolioContext.ts) but worker has old data:

```bash
npm run sync-context
npm run worker:deploy
```

---

## 🔒 Security Best Practices

### ✅ What's Secure

- ✅ API key stored as Cloudflare secret (never in code)
- ✅ CORS properly configured
- ✅ Rate limiting prevents abuse
- ✅ Input sanitization (DOMPurify)
- ✅ No SQL injection risk (no database)

### ⚠️ Don't Do This

- ❌ Never commit `.env` files with API keys
- ❌ Don't hardcode API keys in code
- ❌ Don't disable rate limiting in production
- ❌ Don't skip CORS headers

### 🔄 Rotate API Key

If key is compromised:

```bash
# 1. Get new key from https://aistudio.google.com/
# 2. Update Cloudflare secret
npx wrangler secret put GEMINI_API_KEY
# 3. Redeploy
npm run worker:deploy
```

---

## 📝 Development Workflow

### Local Testing

**Test worker locally:**
```bash
npm run worker:dev
# Worker runs on http://localhost:8787
```

**Test React app:**
```bash
npm start
# App runs on http://localhost:3000
```

### Making Changes

**1. Update Portfolio Context:**
```bash
# Edit src/data/portfolioContext.ts
npm run sync-context
npm run worker:deploy
```

**2. Update Chat UI:**
```bash
# Edit files in src/components/AIChatAssistant/
npm start  # Test locally
npm run deploy  # Deploy to production
```

**3. Update Worker Logic:**
```bash
# Edit worker/index.js
npm run worker:deploy
```

### Testing Strategy

**Manual Testing Checklist:**
- [ ] Chat opens/closes smoothly
- [ ] Messages send and receive
- [ ] Markdown renders correctly
- [ ] Action buttons work
- [ ] Suggested questions work
- [ ] Rate limiting triggers at 6th request
- [ ] Error states display properly
- [ ] Mobile responsive (test on phone)

---

## 💡 Tips & Best Practices

### 1. Keep Context Updated

Update [portfolioContext.ts](../src/data/portfolioContext.ts) when you:
- Add new projects
- Update work experience
- Change skills
- Add travel destinations

Always run `npm run sync-context` after updates!

### 2. Monitor Usage

Check Cloudflare dashboard weekly to:
- Monitor request volume
- Identify popular questions
- Catch errors early

### 3. Optimize for Mobile

Most visitors use mobile. Test on:
- iPhone Safari
- Android Chrome
- Various screen sizes

### 4. Add Analytics (Optional)

Track chat usage by adding analytics events:

```typescript
// In sendMessage function
analytics.track('chat_message_sent', {
  message_length: userMessage.length,
  has_actions: actions.length > 0,
});
```

---

## 🎉 What This Demonstrates

For recruiters/employers viewing your portfolio:

1. **AI Integration** - Real-world Gemini API usage
2. **Serverless Architecture** - Cloudflare Workers expertise
3. **Security** - Proper secrets management
4. **Frontend Skills** - React, TypeScript, modular design
5. **UX Design** - Intuitive chat interface with accessibility
6. **DevOps** - Deployment automation, environment management
7. **Full-Stack** - Frontend + Backend API coordination
8. **Performance** - Rate limiting, lazy loading, optimization

---

## 📚 Additional Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Guide](https://developers.cloudflare.com/workers/wrangler/)
- [React TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)

---

## 💰 Cost Breakdown

**Total Cost: $0/month** for typical portfolio traffic

Both Gemini and Cloudflare have generous free tiers:
- **Gemini**: 1,500 requests/day free
- **Cloudflare Workers**: 100,000 requests/day free
- **Your Rate Limit**: 5 requests/min per visitor

**Example:** Even with 100 unique visitors/day asking 3 questions each = 300 requests/day (well within limits!)

---

## Quick Reference

```bash
# Deploy everything
npm run worker:deploy  # Deploy worker
npm run deploy         # Deploy main site

# Development
npm start              # Run React app locally
npm run worker:dev     # Run worker locally
npm run sync-context   # Sync portfolio context

# Monitoring
npx wrangler tail      # View worker logs
npx wrangler secret list  # List secrets

# Secrets management
npx wrangler secret put GEMINI_API_KEY    # Set API key
npx wrangler secret delete GEMINI_API_KEY # Remove API key
```

---

**Questions?** Check the troubleshooting section above or open an issue on GitHub!
