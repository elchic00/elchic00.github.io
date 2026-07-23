/**
 * Andrew Alagna's Technical Skills
 * Comprehensive list of technologies, tools, and expertise areas
 */

export const SKILLS = `
# Technical Skills

**Role Clarification**: Drew leans frontend (React, TypeScript) but has real backend depth in Python, SQL, and Node.js/JavaScript. He's also written Kotlin for the BFF layer at American Express - real experience, but narrower than his primary backend languages, not his main strength. He runs his own multi-node home infrastructure end-to-end. Describe this in terms of what he's actually built, not a hard percentage split.

**Primary Specialization**: Frontend Web Development with React.js and TypeScript
**Secondary Capabilities**: Backend/Full-Stack Development, self-hosted infrastructure, and AI agent systems

**Languages**:
- **JavaScript (ES6+)** - Expert level, primary language for 4 years (frontend focus)
- **TypeScript** - Production experience at American Express, React + TypeScript daily
- Python - Primary backend/automation language: self-hosted AI agent infrastructure (eval scoring, self-improvement scripts, a voice-transcription relay service), data science projects, algorithms
- SQL - Database queries and management
- HTML5 & CSS3 - WCAG AA compliant, semantic markup (core frontend skills)

**Frontend**:
- **React.js** - 4 years professional experience at American Express, core specialization
- **TypeScript** - Daily use with React, production-level expertise
- **Redux** - State management for enterprise applications
- **HTML5 & CSS3** - WCAG AA compliant, semantic markup, accessibility expert
- **Tailwind CSS** - Modern utility-first styling
- **Component Libraries** - Material UI, custom design systems
- **Responsive Design** - Mobile-first, cross-browser compatibility
- **Single Page Applications** - React Router, client-side routing
- **Performance Optimization** - React rendering, component optimization, bundle optimization
- **Accessibility (WCAG AA)** - Raised audit scores to 100% across enterprise Account Services surfaces
- **A/B Testing** - Frontend experimentation, analytics integration
- **UI/UX Implementation** - Translating designs to production code

**Backend & APIs**:
- Python - Backend services and automation for self-hosted infrastructure (see Languages above)
- Node.js - Full-stack development, API creation
- GraphQL - API design and implementation
- REST APIs - Design, consumption, and optimization
- BFF (Backend for Frontend) Architecture - Production experience at American Express, including a Kotlin-based BFF layer
- Microservices - Enterprise-scale distributed systems
- Express.js - Server-side JavaScript applications

**Databases & Data**:
- PostgreSQL - Production database management
- MySQL - Relational database design
- SQLite - Lightweight database solutions
- MongoDB - NoSQL document databases
- Supabase - Backend-as-a-service
- Firebase - Real-time databases, authentication
- sqlite-vec - Local vector store backing the Hermes agent's note retrieval (evaluated ChromaDB + mem0-oss first, pulled it)
- Data Science - Pandas, Matplotlib, NumPy

**DevOps & Infrastructure**:
- AWS - Cloud infrastructure and deployment
- Docker - Containerization and container orchestration
- Git - Version control, branching strategies
- GitHub Actions - CI/CD pipeline automation
- Wrangler - Cloudflare Workers deployment
- **Homelab** - A 3-node self-hosted setup: Pi-Cloud (edge services) and Hermes (AI agent platform) - see below

**Testing & Quality**:
- Jest - Unit testing
- React Testing Library - Component testing
- Quality Assurance - Enterprise-level testing strategies

**Core Expertise**:
- WCAG AA Accessibility - Raised audit scores to 100% across enterprise Account Services surfaces
- Agile/Scrum Methodologies - Enterprise team collaboration
- A/B Testing - Analytics-backed profile-flow optimization with +18% completion and +16% start-rate lifts
- State Management - Redux, Context API, complex application state
- Performance Optimization - React rendering, API optimization, BFF architecture

**Homelab - Hermes & Pi-Cloud**:

Drew runs a 3-node home infrastructure spanning self-hosted services and a self-hosted AI agent platform, treating it as a real engineering project rather than a hobby install.

**Nodes**:
- **Framework Desktop** - Local LLM inference, running large open-weight models fully on GPU instead of relying on hosted APIs
- **Mac Mini** - Orchestrates Hermes' scheduled agent workflows, multi-model routing, and retrieval/memory
- **Raspberry Pi 5** - Runs Pi-Cloud, 12 self-hosted services (photos, passwords, documents, DNS, search, monitoring, security), several replacing paid SaaS

**Hermes (AI agent platform)**:
- Multi-model routing across locally-hosted models
- Execution tracing and an eval loop via Langfuse
- Human-in-the-loop approval gates before any side-effecting action executes
- Self-hosted search (SearXNG) and local vector retrieval (sqlite-vec, Ollama embeddings) in place of hosted equivalents

**Pi-Cloud (edge services, zero-trust networking)**:
- **Tailscale** (WireGuard-based mesh VPN) for secure remote/public-network access with no open ports exposed to the internet
- **CrowdSec** - community-driven intrusion prevention with automated threat detection
- **Pi-hole + Unbound** - network-wide ad/tracker blocking backed by a recursive DNS resolver that talks directly to root nameservers, bypassing third-party DNS
- **Prometheus + Grafana** - metrics collection and dashboards
- **Watchtower** - automated container updates with rolling, zero-downtime deploys
- **Immich, Vaultwarden, Paperless-ngx** - self-hosted photo library, password manager, and document management, replacing their paid SaaS equivalents

**Frontend Engineering Connection**:
Running this infrastructure directly informs how Drew thinks about frontend architecture - API design, caching strategy, and user-perceived performance - because he's felt the tradeoffs from the infrastructure side, not just the client side.

**Additional Technologies**:
- React Native - Mobile development (myPal project)
- .NET - Backend development with C#
- ArcGIS Pro - Geographic Information Systems
- Vite - Modern build tooling
- Raspberry Pi / ARM64 - Edge computing and embedded systems
`;
