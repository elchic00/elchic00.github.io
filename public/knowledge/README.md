# RAG for AI Chat - Simplified

This folder contains project data for the AI chat's RAG (Retrieval-Augmented Generation) system.

## How It Works

1. **projects.json** contains your project information
2. When a user asks about projects, the chat retrieves relevant project details
3. These details are appended to your existing worker context
4. The AI responds with grounded, accurate project information

## Updating Projects

Simply edit `projects.json` with new project information and redeploy. No embeddings or build scripts needed.

## What Changed

- Removed: Complex embedding generation, resume/experience files, build scripts
- Kept: Simple project JSON with hash-based similarity search
- Result: ~100 lines of code total, no API keys, works offline
