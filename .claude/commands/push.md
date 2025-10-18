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
   - Add detailed bullet points in the body explaining what changed and why
   - Include technical details that would help someone understand the changes
4. Push all commits to remote. Use `git done`, my custom alias, to push to github
5. Report back with commit hashes and a summary of what was pushed

Guidelines:

- Split commits when changes address different features, bugs, or areas of the codebase
- Combine commits when changes are part of the same logical unit of work
- Never include sensitive information or credentials in commit messages
- Always use descriptive, professional language
- Include file paths and line numbers when relevant
- Do NOT include me (Claude) as the commit author - use only the user's git config

After pushing, provide a brief summary of what was committed and the commit hash(es).
