// Cloudflare Worker for AI Chat Assistant
// This worker proxies requests to Google Gemini API to keep your API key secure

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// NOTE: This context is duplicated from src/data/portfolioContext.ts
// When updating this content, make sure to update both files to keep them in sync
// Portfolio context embedded in worker
const PORTFOLIO_CONTEXT = `${SYSTEM_PROMPT}

${BIOGRAPHY}

${SKILLS}`;

// Rate limiting using Cloudflare KV (simple in-memory for now)
const rateLimitMap = new Map();
const RATE_LIMIT = 5; // requests per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];

  // Filter out old requests
  const recentRequests = userRequests.filter(
    (time) => now - time < RATE_LIMIT_WINDOW
  );

  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

async function handleChatRequest(request, env) {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle OPTIONS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    // Get API key from environment variable
    const GEMINI_API_KEY = env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    // Rate limiting
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again in a minute.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { message, messages = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build conversation history for Gemini
    // Always start with the portfolio context as a system primer
    const conversationHistory = [
      {
        role: "user",
        parts: [{ text: PORTFOLIO_CONTEXT }],
      },
      {
        role: "model",
        parts: [
          {
            text: "I understand. I'm Andrew's AI assistant and will answer questions about his experience, projects, and skills professionally and conversationally based on the information provided.",
          },
        ],
      },
    ];

    // Add recent conversation history (skip the initial greeting)
    const recentMessages = messages
      .filter(
        (msg) =>
          msg.content !==
          "Hi! I'm Andrew's AI assistant. Ask me about his experience, projects, skills, or travel adventures!"
      )
      .slice(-8) // Keep last 8 messages to leave room for context
      .map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    conversationHistory.push(...recentMessages);

    // Add current user message
    conversationHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Call Gemini API
    const geminiResponse = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1100,
            topP: 0.8,
            topK: 40,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      throw new Error("Failed to get response from AI");
    }

    const data = await geminiResponse.json();

    // Check if response was blocked or empty
    if (!data.candidates || data.candidates.length === 0) {
      console.error("No candidates returned:", JSON.stringify(data));
      const aiResponse =
        "I apologize, but I'm having trouble with that question. Try asking about Andrew's specific experience at American Express, his projects, technical skills, or travel experiences!";
      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const candidate = data.candidates[0];

    // Check if response was blocked by safety filters
    if (candidate.finishReason === "SAFETY" || !candidate.content) {
      console.error(
        "Response blocked or no content:",
        JSON.stringify(candidate)
      );
      const aiResponse =
        "I apologize, but I couldn't generate a response for that. Try asking about Andrew's work at American Express, his technical projects, or his travel photography!";
      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse =
      candidate.content?.parts?.[0]?.text ||
      "I'm having trouble processing that. Could you rephrase your question?";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      return handleChatRequest(request, env);
    }

    return new Response("Not found", { status: 404 });
  },
};
