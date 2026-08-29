---
paths:
  - "docs/**"
  - "**/*.md"
---

# Documentation Rules

- Keep repository documentation accurate to current paths and behavior; derive volatile values (versions, bindings, model names, counts) from source rather than restating them, and point readers at the source file.
- When you touch an area and notice its doc, `AGENTS.md`, or a `.claude/rules/` file is now wrong or contradicts the code, fix it in the same change. If the fix is genuinely out of scope, say so in your summary.
- Update the external Obsidian mirror only when explicitly requested and the directory is available.
- Do not expand normal code changes into external documentation cleanup.
- Documentation-only changes do not require a build unless they alter executable examples or paths whose validity needs verification.
