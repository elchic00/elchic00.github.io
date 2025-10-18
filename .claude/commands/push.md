---
description: Create descriptive commits and push to remote (splits into multiple commits if needed)
---

Analyze all uncommitted changes and create descriptive, well-structured git commits, then push to remote.

Instructions:

1. Run `git status` and `git diff` to understand all changes
2. Analyze the changes and determine if they should be split into multiple logical commits or combined into one
3. For each commit:
   - Create a descriptive commit message following conventional commits format (feat:, fix:, refactor:, docs:, etc.)
   - Include a clear summary line (50-72 chars)
   - Add a concise body (2-5 bullet points) explaining:
     - What changed at a high level
     - Why the change was made (motivation/context)
     - Non-obvious implementation decisions
   - **Avoid**: Exhaustive lists, line numbers, file paths (visible in diff), implementation details obvious from the diff
   - **Focus on**: The "why" and context, not just the "what"
4. Push all commits to remote using `git done` (custom alias)
5. Run `npm run deploy` to deploy to GitHub Pages
6. Report back with commit hashes and a summary of what was pushed

Commit message example:
refactor: redesign Skills with color-coded pill badges Replace box layout with rounded pills using themed colors for visual hierarchy. Add hover animations for better interactivity. Improves scannability and matches site's modern aesthetic (cyan/teal/purple theme).

Guidelines:

- Split commits when changes address different features, bugs, or areas of the codebase
- Combine commits when changes are part of the same logical unit of work
- Keep commit bodies concise but informative (avoid wall-of-text descriptions)
- Never include sensitive information or credentials in commit messages
- Always use descriptive, professional language
- Do NOT include me (Claude) as the commit author - use only the user's git config

After pushing, provide a brief summary of what was committed and the commit hash(es).
