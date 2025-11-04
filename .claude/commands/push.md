---
description: Create descriptive commits and push to remote (splits into multiple commits if needed)
---

Analyze all uncommitted changes and create descriptive, well-structured git commits, then push to remote.

Instructions:

1. **Check for portfolio context changes:**
   - Check if `src/data/portfolioContext.ts` has been modified: `git diff --name-only | grep portfolioContext.ts`
   - If it has changed, run `npm run sync-context` to sync it to `worker/index.js`
   - Stage the synced worker file if changes were made: `git add worker/index.js`
2. Run `git status` and `git diff` to understand all changes
3. Analyze the changes and determine if they should be split into multiple logical commits or combined into one
4. For each commit:
   - Create a descriptive commit message following conventional commits format (feat:, fix:, refactor:, docs:, etc.)
   - Include a clear summary line (50-72 chars)
   - Add a concise body (2-5 bullet points) explaining:
     - What changed at a high level
     - Why the change was made (motivation/context)
     - Non-obvious implementation decisions
   - **Avoid**: Exhaustive lists, line numbers, file paths (visible in diff), implementation details obvious from the diff
   - **Focus on**: The "why" and context, not just the "what"
5. Push all commits to remote using `git done` (custom alias)
6. Run `npm run deploy` to deploy to GitHub Pages
7. Report back with commit hashes and a summary of what was pushed

Commit message example:
```
refactor: redesign Skills with color-coded pill badges

Replace box layout with rounded pills using themed colors for visual hierarchy. Add hover animations for better interactivity. Improves scannability and matches site's modern aesthetic (cyan/teal/purple theme).
```

Guidelines:

- **CRITICAL**: Do NOT include any co-author lines, attribution to Claude, or "Generated with Claude Code" text in commit messages
- **CRITICAL**: Use ONLY the user's git identity - never add yourself (Claude) as author or co-author
- Split commits when changes address different features, bugs, or areas of the codebase
- Combine commits when changes are part of the same logical unit of work
- Keep commit bodies concise but informative (avoid wall-of-text descriptions)
- Never include sensitive information or credentials in commit messages
- Always use descriptive, professional language
- Commit messages should contain ONLY: type, scope (optional), subject, and body - nothing else

After pushing, provide a brief summary of what was committed and the commit hash(es).
