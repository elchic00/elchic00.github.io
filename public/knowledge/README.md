# Structured Project Context for AI Chat

This folder contains the compact, structured project reference sheet for the AI chat.

## How It Works

1. **projects.json** contains your project information
2. The Worker sends the complete project reference sheet with the existing portfolio context on every request
3. The model answers from that complete, auditable set of project details
4. The AI responds with grounded, accurate project information

## Updating Projects

Simply edit `projects.json`, then run `npm run sync-context` before deploying. No embeddings, vector store, or ranking heuristic is needed while the corpus remains this small.

## What Changed

- Removed: Retrieval, embedding generation, and ranking logic
- Kept: One complete, reviewable project reference sheet
- Result: predictable context grounding without extra infrastructure
