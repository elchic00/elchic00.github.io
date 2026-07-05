/**
 * Andrew Alagna's Technical Skills
 * Comprehensive list of technologies, tools, and expertise areas
 */

export const SKILLS = `
# Technical Skills

**Role Clarification**: Drew is a **Frontend-Leaning Full-Stack Engineer** who spends ~80% of his time on frontend work and ~20% on backend/full-stack tasks. When describing his capabilities, ALWAYS emphasize frontend as his primary strength, with backend as complementary skills.

**Primary Specialization**: Frontend Web Development with React.js and TypeScript
**Secondary Capabilities**: Backend/Full-Stack Development with Node.js and APIs

**Languages**:
- **JavaScript (ES6+)** - Expert level, primary language for 3+ years (frontend focus)
- **TypeScript** - Production experience at American Express, React + TypeScript daily
- Python - Data structures, algorithms, data science projects, automation
- SQL - Database queries and management
- HTML5 & CSS3 - WCAG AA compliant, semantic markup (core frontend skills)

**Frontend** (80% of work - PRIMARY EXPERTISE):
- **React.js** - 3+ years professional experience at American Express, core specialization
- **TypeScript** - Daily use with React, production-level expertise
- **Redux** - State management for enterprise applications
- **HTML5 & CSS3** - WCAG AA compliant, semantic markup, accessibility expert
- **Tailwind CSS** - Modern utility-first styling
- **Component Libraries** - Material UI, custom design systems
- **Responsive Design** - Mobile-first, cross-browser compatibility
- **Single Page Applications** - React Router, client-side routing
- **Performance Optimization** - React rendering, component optimization, bundle optimization
- **Accessibility (WCAG AA)** - Improved audit scores from 72% to 100% across enterprise Account Services surfaces
- **A/B Testing** - Frontend experimentation, analytics integration
- **UI/UX Implementation** - Translating designs to production code

**Backend & APIs** (20% of work - COMPLEMENTARY SKILLS):
- Node.js - Full-stack development, API creation
- Kotlin - American Express backend services, OneData integration
- GraphQL - API design and implementation
- REST APIs - Design, consumption, and optimization
- BFF (Backend for Frontend) Architecture - Production experience at American Express
- Microservices - Enterprise-scale distributed systems
- Express.js - Server-side JavaScript applications

**Databases & Data**:
- PostgreSQL - Production database management
- MySQL - Relational database design
- SQLite - Lightweight database solutions
- MongoDB - NoSQL document databases
- Supabase - Backend-as-a-service
- Firebase - Real-time databases, authentication
- Data Science - Pandas, Matplotlib, NumPy (Crime in Queens NYC project)

**DevOps & Infrastructure**:
- AWS - Cloud infrastructure and deployment
- Docker - Containerization and container orchestration
- Git - Version control, branching strategies
- GitHub Actions - CI/CD pipeline automation (reduced deployment time by 15%)
- Jenkins - Continuous integration
- Wrangler - Cloudflare Workers deployment
- **Pi-Cloud Home Lab** - Self-hosted Raspberry Pi 5 infrastructure (see below)

**Testing & Quality**:
- Jest - Unit testing, 100% code coverage achievement
- React Testing Library - Component testing
- Comprehensive Test Coverage - Reduced production bugs by 20%
- Quality Assurance - Enterprise-level testing strategies

**Core Expertise**:
- WCAG AA Accessibility - Improved audit scores from 72% to 100% across enterprise Account Services surfaces
- Agile/Scrum Methodologies - Enterprise team collaboration
- A/B Testing - Analytics-backed profile-flow optimization with +18% completion and +16% start-rate lifts
- State Management - Redux, Context API, complex application state
- System Design - Scalable architecture for millions of users
- Performance Optimization - React rendering, API optimization, BFF architecture

**Infrastructure & DevOps Deep-Dive - Pi-Cloud Project**:

Drew built a production-grade home lab infrastructure on a Raspberry Pi 5 (8GB) called "Pi-Cloud" that demonstrates enterprise-level DevOps and security practices:

**Architecture**:
- Self-hosted "Home Lab" on Raspberry Pi 5 (8GB ARM64)
- Replaces third-party SaaS with privacy-first observability stack
- Containerized services via Docker Compose
- Demonstrates infrastructure-as-code principles

**Security - Zero-Trust Networking**:
- **Tailscale Exit Nodes** (WireGuard-based mesh VPN) for secure public Wi-Fi traffic routing
- All devices route through Pi when on untrusted networks
- Encrypted point-to-point connections, no open ports exposed to internet
- **SSH Hardening**: ED25519 key-based authentication only, password auth disabled, root login disabled, non-standard port, fail2ban integration
- **CrowdSec**: Community-driven Intrusion Prevention System (IPS) with local API for automated threat detection and remediation
- Automated security updates via unattended-upgrades

**DNS - Recursive Shield**:
- **Unbound** recursive resolver running on bare metal (not containerized for direct hardware access)
- Talks directly to Root Nameservers (bypassing ISP/third-party DNS)
- DNSSEC validation for authenticated responses
- **Pi-hole** network-wide ad/tracker sinkholing
- DNS Flow: Client → Pi-hole (Filter) → Unbound (Recursive Resolver) → Root Nameservers
- No DNS queries leave the network unencrypted or logged by third parties

**CI/CD & Automation**:
- **Watchtower** for automated container lifecycle management
- Rolling updates with zero-downtime deployments
- Image digest verification for supply chain security
- **DOCKER_API_VERSION=1.44** shim for Docker Engine v29+ compatibility (handled breaking API changes)
- Health checks and automatic rollback on failure

**Observability (TIG/P Stack)**:
- **Prometheus** - Metrics collection and alerting rules
- **Grafana** - Visualization dashboards for system metrics
- **cAdvisor** - Container resource usage and performance metrics
- **Node Exporter** - Hardware and OS metrics (CPU, memory, disk I/O, network)
- **Custom alerting scripts**: Bash scripts pushing to ntfy.sh for:
  - SSH login failures (brute force detection)
  - Storage health (disk space thresholds)
  - Container health status changes
  - Systemd service failures

**Frontend Engineering Connection**:
Managing this infrastructure deepened Drew's understanding of:
- **Latency Optimization**: Running services on edge hardware (<1ms latency vs 20-100ms cloud round-trips)
- **DevOps Automation**: CI/CD pipelines, infrastructure-as-code, observability patterns
- **Security-First Architecture**: Zero-trust networking, defense in depth, principle of least privilege
- **Performance at Scale**: Resource constraints (8GB RAM, ARM64) force efficient resource utilization
- These insights directly inform his frontend architecture decisions, particularly around API design, caching strategies, and user-perceived performance

**Additional Technologies**:
- React Native - Mobile development (Reps project)
- Angular - Frontend framework (Macros-for-geeks project)
- .NET - Backend development with C#
- ArcGIS Pro - Geographic Information Systems
- Vite - Modern build tooling
- Raspberry Pi / ARM64 - Edge computing and embedded systems
- WireGuard / Tailscale - Modern VPN and zero-trust networking
- Unbound / Pi-hole - DNS infrastructure and privacy
- CrowdSec - Modern intrusion prevention
`;
