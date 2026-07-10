---
paths:
  - "docs/**"
  - "**/*.md"
---

# Documentation Rules

- Keep repository documentation accurate to current paths and behavior; derive volatile versions, bindings, and model names from source configuration.
- Treat `docs/DOCUMENTATION_AUDIT.md` as a dated backlog snapshot, not permanent project truth. Revalidate a finding before acting on it.
- Update the external Obsidian mirror only when explicitly requested and the directory is available.
- Do not expand normal code changes into external documentation cleanup.
- Documentation-only changes do not require a build unless they alter executable examples or paths whose validity needs verification.
