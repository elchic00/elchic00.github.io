---
description: Create descriptive commits and push to remote (splits into multiple commits if needed)
---

Analyze all uncommitted changes and create descriptive, well-structured git commits, then push to remote.

Instructions:

1. **Check for portfolio context changes:**
   - Check if `src/data/portfolioContext.ts` has been modified: `git diff --name-only | grep portfolioContext.ts`
   - If it has changed, run `npm run sync-context` to sync it to `worker/index.js`
   - Stage the synced worker file if changes were made: `git add worker/index.js`

2. **Review all changes:**
   - Run `git status` to see all modified/untracked files
   - Run `git diff` to see unstaged changes
   - Run `git diff --staged` to see already-staged changes (if any)
   - Review the output carefully before proceeding

3. **Determine commit strategy:**
   - **Split into multiple commits** when:
     - Changes address different features, bugs, or concerns (e.g., fix + refactor in different files)
     - Changes affect different domains (e.g., UI component + documentation)
     - One change is a prerequisite for another (commit them in logical order)
   - **Combine into one commit** when:
     - All changes are part of the same feature/fix
     - Changes are tightly coupled (e.g., component + its styles + its tests)
     - Splitting would create incomplete/broken intermediate states

4. **Create commits:**
   For each commit:
   - Use conventional commits format: `type(optional-scope): description`
   - **Types:** feat, fix, refactor, docs, style, test, perf, chore, build, ci
   - **Summary line:** 50-72 characters, imperative mood (e.g., "add", not "added" or "adds")
   - **Body (2-5 concise bullet points):**
     - What changed at a high level (not line-by-line)
     - Why the change was made (motivation/context)
     - Impact or benefit (performance, UX, maintainability)
     - Non-obvious implementation decisions
   - **Avoid:** File paths, line numbers, exhaustive details (visible in diff), implementation minutiae
   - **Focus on:** The "why" and business/technical context

5. **Push changes:**
   - Push all commits to remote using `git done` (alias for `git push origin main`)
   - Verify push was successful

6. **Report summary:**
   - List each commit with its hash and message
   - Summarize what was accomplished overall
   - Note: GitHub Actions will automatically deploy to GitHub Pages

**Pre-flight checks:**
- Ensure no TODO comments, console.logs, or debug code is being committed
- Verify no sensitive data (API keys, credentials) in changes
- Check that changes don't break existing functionality

**Commit message examples:**

Good ✅:
```
refactor: redesign Skills with color-coded pill badges

Replace box layout with rounded pills using themed colors for visual hierarchy. Add hover animations for better interactivity. Improves scannability and matches site's modern aesthetic (cyan/teal/purple theme).
```

```
fix(navbar): correct mobile breakpoint from 768px to 1024px

Mobile menu was collapsing too early on tablets. Adjusted breakpoint to lg (1024px) for better responsive behavior on iPad and similar devices. Improves UX by keeping full navigation visible on larger tablets.
```

Bad ❌:
```
update stuff

- changed navbar.tsx line 16
- modified useWindowSize import
- updated className on line 132
```
(Too vague, lists implementation details visible in diff)

---

**Critical guidelines:**

- **CRITICAL**: Do NOT include any co-author lines, attribution to Claude, or "Generated with Claude Code" text in commit messages
- **CRITICAL**: Use ONLY the user's git identity - never add yourself (Claude) as author or co-author
- **CRITICAL**: Commit messages should contain ONLY: type, optional scope, subject, and body - nothing else
- Never include sensitive information or credentials in commit messages
- Always use descriptive, professional language
- Use imperative mood in subject line ("add feature", not "added feature" or "adds feature")
- Keep each commit focused on one logical change
