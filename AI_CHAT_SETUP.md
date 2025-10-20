# AI Chat Assistant Setup Guide

This guide will help you deploy the AI-powered chat assistant to your portfolio website.

## Overview

The AI chat assistant uses:
- **Frontend**: React component with floating chat button
- **AI Provider**: Google Gemini 1.5 Flash (free tier)
- **Backend**: Cloudflare Worker (serverless proxy to keep API key secure)

## Features

✅ Free tier (15 requests/min, 1500 requests/day)
✅ High-quality responses with full portfolio context
✅ Rate limiting (5 requests per minute per IP)
✅ Secure API key handling (never exposed to frontend)
✅ Beautiful animated chat UI
✅ Conversational memory (last 10 messages)

## Setup Instructions

### Step 1: Install Dependencies

Wrangler is already included in the project. Just install dependencies:

```bash
npm install
```

### Step 2: Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window to authenticate with Cloudflare.

### Step 3: Set Up Your Gemini API Key as a Secret

**IMPORTANT**: Before deploying, you must set up your Gemini API key as a Cloudflare Worker secret:

```bash
npx wrangler secret put GEMINI_API_KEY
```

When prompted, paste your Gemini API key (get one at https://aistudio.google.com/app/apikey).

This keeps your API key secure and never commits it to your repository.

### Step 4: Deploy the Worker

From your project root:

```bash
npx wrangler deploy
# Or use the npm script:
npm run worker:deploy
```

This will deploy your worker and give you a URL like:
```
https://portfolio-ai-chat.YOUR-USERNAME.workers.dev
```

### Step 5: Update API Endpoint in React Component

Edit `src/components/AIChatAssistant.tsx` and update the fetch URL:

```typescript
const response = await fetch("https://portfolio-ai-chat.YOUR-USERNAME.workers.dev/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: userMessage, messages }),
});
```

Replace `YOUR-USERNAME` with your actual Cloudflare Workers subdomain.

### Step 6: Test Locally (Optional)

Before deploying to production, test the worker locally:

```bash
npx wrangler dev --remote
# Or use the npm script:
npm run worker:dev
```

The `--remote` flag allows the worker to access your secrets. Then update the fetch URL temporarily to `http://localhost:8787/api/chat` for testing.

### Step 7: Deploy to GitHub Pages

Once everything works:

```bash
npm run deploy
```

## Security Notes

✅ **SECURE**: The worker is configured to use environment variables for the API key.

- Your API key is stored as a Cloudflare Worker secret (never in code)
- The key is never exposed to the frontend or committed to Git
- Access is controlled through Cloudflare's secure environment

**To rotate your API key:**

```bash
npx wrangler secret put GEMINI_API_KEY
# Then paste your new API key when prompted
```

**Never commit API keys to your repository!**

## Customization

### Update Portfolio Context

Edit `worker/index.js` and modify the `PORTFOLIO_CONTEXT` constant to update what the AI knows about you.

### Adjust Rate Limits

In `worker/index.js`, modify:
```javascript
const RATE_LIMIT = 5; // requests per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute
```

### Change AI Temperature

In `worker/index.js`, adjust the `generationConfig`:
```javascript
generationConfig: {
  temperature: 0.7, // Lower = more focused, Higher = more creative
  maxOutputTokens: 500,
}
```

## Monitoring & Limits

### Free Tier Limits (Google Gemini)
- **Rate limit**: 15 requests per minute
- **Daily limit**: 1,500 requests per day
- **Token limit**: 1M tokens per minute

### Check Usage

Monitor your API usage at:
- Gemini: https://ai.google.dev/
- Cloudflare Workers: https://dash.cloudflare.com/

## Troubleshooting

### "Rate limit exceeded"
Users are limited to 5 requests per minute. Wait 60 seconds and try again.

### "Failed to get response from AI"
- Check your API key is correct
- Verify Gemini API is enabled at https://ai.google.dev/
- Check Cloudflare Worker logs: `wrangler tail`

### Chat button appears but doesn't work
- Check browser console for errors
- Verify the worker URL is correct in `AIChatAssistant.tsx`
- Ensure CORS headers are properly set (they are by default)

### Worker deployment fails
- Make sure you're logged in: `npx wrangler login`
- Check `wrangler.toml` is properly configured
- Verify your Cloudflare account is set up

## Cost Breakdown

- **Gemini API**: FREE (up to 1,500 requests/day)
- **Cloudflare Workers**: FREE (up to 100,000 requests/day)
- **Total**: $0/month for typical portfolio traffic

## Next Steps

1. Test the chat with various questions about your experience
2. Monitor usage and adjust rate limits if needed
3. Consider adding analytics to track popular questions
4. Optionally add a feedback mechanism for response quality

## Support

If you encounter issues:
1. Check Cloudflare Worker logs: `npx wrangler tail`
2. Review browser console for frontend errors
3. Test the worker endpoint directly with curl:

```bash
curl -X POST https://your-worker.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Andrew"}'
```

---

**Note**: Remember to keep your API key secure and never commit it to public repositories!
