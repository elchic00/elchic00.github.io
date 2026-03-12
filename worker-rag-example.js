// Example: Minimal worker update for RAG support
// Just add projectContext to your existing worker

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      const { message, messages, projectContext } = await request.json();
      
      // Your existing PORTFOLIO_CONTEXT stays the same
      let systemPrompt = PORTFOLIO_CONTEXT;
      
      // Add dynamic project context if available
      if (projectContext) {
        systemPrompt += "\n\n" + projectContext;
      }
      
      // Rest of your existing code...
    }

    return new Response("Not found", { status: 404 });
  },
};
