/**
 * Andrew Alagna's Professional Biography
 * Contains personal background, education, work experience, and achievements
 */

export const BIOGRAPHY = `
# About Andrew
- Full Name: Andrew Alagna (goes by "Drew")
- Contact: New York, NY | aalagna04@gmail.com
- LinkedIn: https://www.linkedin.com/in/andrew-a-10b88215b/
- Portfolio: https://elchic00.github.io/
- GitHub: https://github.com/elchic00
- Title: Software Engineer | React & TypeScript, with real backend and infrastructure depth
- Current Role: Software Engineer at American Express (August 2022 - Present, 4 years)
- Drew leans frontend (React, TypeScript) but has genuine backend depth in Python, SQL, and Node.js/JavaScript. He's also written Kotlin for the BFF layer at American Express — real experience, but narrower than his primary backend languages. He runs his own multi-node home infrastructure end-to-end. Don't reduce this to a hard percentage split.
- Location: New York, New York, United States
- Education: Hunter College (CUNY), Bachelor of Arts in Computer Science (May 2022, GPA: 3.62, Cum Laude)
- Professional Summary: Software Engineer with 4 years building high-performance, WCAG AA-compliant web applications at American Express, plus a self-hosted homelab where he builds infrastructure and AI agent systems in his own time. His Amex work spans MYCA Overview - the authenticated landing page for cardholders - and Account Services profile flows, including revenue-focused personalization work, routing cardholders to offers on their eligible cards, accessibility work extended to 10 international markets, ~5M annual profile updates, and analytics-backed profile-flow improvements.
- Philosophy: "With a BA in Computer Science from CUNY: Hunter College, my foundation in algorithms and data structures complements my passion for creating scalable, data-driven applications. My commitment to fostering inclusive technology is evident through my accessibility work and mentorship roles at CodePath and Hunter College, where I supported hundreds of students in their technology journeys. I believe in paying it forward. If you're a first-generation student, come from a low-income background, or are underrepresented in tech, I'd be happy to be a resource and support you however I can."
- Open to Volunteering: Education, Science and Technology causes
- Certifications: Harvard Leadership Edge: Communicating to Connect - Connect with Others (Harvard Business Publishing, August 2023)
- Core Values: Accessibility, inclusivity, mentorship, giving back to underrepresented communities
- Passionate about: WCAG AA accessibility, performance optimization, self-hosted infrastructure and AI agents, mentoring first-generation and underrepresented students
- Current Mentorship: Actively leads weekly mentorship sessions for CodePath's open source course (group of 5 students) and provides 1-on-1 career guidance to 2 Hunter College students through alumni mentorship program
- Interests: Travel, bouldering, calisthenics/bodyweight fitness, hiking and exploring nature, self-hosted homelab and AI infrastructure

# Professional Experience

## American Express - Software Engineer (08/2022 - Present)
Key Achievements:
- **Accessibility Leadership**: Made digital banking surfaces more accessible by implementing WCAG AA patterns, starting with the US market and later extending to 10 international markets. Screen reader users, keyboard-only navigators, and users with visual impairments can more reliably manage accounts and update profile information independently.
- **User Account Management**: Built and improved profile update flows supporting ~5M annual profile updates across Web and Mobile, making it easier to update address, phone, email, and other sensitive information with clearer validation and secure React/Kotlin BFF flows.
- **Card Offer Routing**: Built a flow that helps cardholders find offers available to them - clicking an offer surfaces which of their cards are eligible, then routes to that offer's enrollment page for the selected card.
- **MYCA Overview Screen**: Since early 2026, has worked on the authenticated account overview/landing screen cardholders see after login - account summaries, reward balances, personalized offers, spend-habit insights, and revenue-focused personalization (showing cardholders the products, offers, and insights most relevant to them) across rendering, analytics, and routing logic.
- **Eligible-Card Offer Routing**: Built offer flows from Overview that show which cards are eligible for a selected offer and route customers into enrollment with the right card context.
- **Form Completion Experience**: Improved supplementary-profile completion by 18% and start rate by 16% through analytics-backed iteration and profile-flow optimization.
- **Experimentation**: Runs and analyzes A/B experiments (6 experiment configurations) to validate UX changes before full rollout.
- **Quality & Reliability**: Built testing and release practices for enterprise-scale React applications, reducing risk in sensitive account-management flows.

## CodePath - Teaching Assistant, Intro to Software Engineering (05/2022 - 08/2022)
- Led weekly instruction sessions for 180+ students in Python-based Data Structures & Algorithms, achieving 90% student satisfaction rating
- Designed 20+ coding exercises and debugging workshops that improved student technical interview performance
- Mentored students on technical concepts and career readiness

## NYC Department of Transportation - GIS Intern (04/2022 - 08/2022)
- Engineered Python application to optimize processing and visualization of NYC's census data
- Streamlined data organization using Python automation, reducing processing time from weeks to seconds

## CodePath - Volunteer Teaching & Mentoring (06/2021 - Present)

**Current Role - Open Source Mentor (September 2025 - Present):**
- Leading weekly mentorship sessions for 5 students in open source contribution
- Teaching GitHub workflows, PR creation, and navigating unfamiliar codebases with AI tools
- Providing guidance on early career readiness and professional development
- Focus: helping students make their first open source contributions and build confidence

**Previous Roles:**
- **Technical Coach (Intermediate) - Summer 2024 (June 2024 - August 2024, 3 months)**
  - Guided groups of 4-6 students weekly in mastering Data Structures & Algorithms
  - Ensured collaborative progress and effective problem-solving
  - Provided comprehensive career guidance and technical interview preparation

- **Technical Coach (Intermediate) - Summer 2023 (June 2023 - August 2023, 3 months)**
  - Guided groups of 4-6 students weekly in mastering Data Structures & Algorithms
  - Ensured collaborative progress and effective problem-solving
  - Certificate issued for coaching students on data structure & algorithm technical interview preparation

- **Teaching Assistant - Intro to Software Engineering (May 2022 - August 2022, 4 months)**
  - Led instruction for over 180 students in Data Structures & Algorithms using Python
  - Developed and presented engaging weekly review lessons to enhance student understanding
  - Facilitated collaborative problem-solving in small groups, monitoring progress on assignments

- **Tech Fellow (June 2021 - April 2022, 11 months)**
  - Served as an instructor for cybersecurity fundamentals at CUNY: Hunter College
  - Beyond preparing and presenting engaging weekly lessons, actively supported students through hands-on debugging during labs and CTF assignments
  - This initiative provided free certification to roughly 100 students

**Total Impact:** Mentored 350+ students across multiple cohorts - roughly 100 through the cybersecurity certification track, and about 200 split across two data structures & algorithms / technical interview-prep classes.

## Hunter College - Alumni Mentor (Present)
- Provides 1-on-1 career mentorship to 2 current Hunter students through official alumni mentorship program
- Meets occasionally via video/phone with async communication on LinkedIn between sessions
- **Key Areas of Guidance:** technical interview preparation, side-project ideation and execution, resume/portfolio optimization for junior roles, navigating the tech job market as a college student, building professional network and personal brand
- Shares real-world insights from American Express and personal career transition journey

# Professional Work & Projects

When asked about "what projects has he built", include both his professional work at American Express and his personal projects.

## Professional Work at American Express

**MYCA Overview Team** (early 2026 - Present; React.js, TypeScript, analytics, personalization, routing)
- Works on the authenticated Overview landing page for existing American Express cardholders
- Built revenue-focused personalization work - showing cardholders the products, offers, and insights most relevant to them - across analytics, rendering, routing, and account placement
- Built offer-to-card routing that shows cardholders which cards are eligible for a personalized offer and enrolls them with the right card
- Built and debugged account/rewards/offers surfaces and preference-driven account grouping on a high-visibility landing page
- Led Selenium-to-Playwright migration work, monorepo onboarding, and reusable playbooks on the Overview team
- Modernized CI workflows across Overview-owned repositories and advocated for practical AI-assisted engineering workflows

**Account Services / Profile Flows** (August 2022 - early 2026; React.js, Node.js, Kotlin BFF, GraphQL)
- Built front-end microservices modules enabling users to view and edit profile information (name, address, email, phone number, income)
- Built supplementary profile flows where users can select and persist a chosen supplementary card across profile journeys
- Led first production BFF/WPS implementation for updating the phone/email used for two-factor authentication
- Co-designed Qualifiers API integration used across card and banking products
- Supporting ~5M annual profile updates with secure account management capabilities

## Personal Projects

1. **Hermes** (Self-Hosted Agent Platform, built on Nous Research's open-source hermes-agent)
   - hermes-agent is Nous Research's open-source (MIT-licensed) agent harness - Drew didn't write the framework itself; he deployed it, routed it entirely to self-hosted local models instead of the cloud providers it ships with (Nous Portal, OpenRouter, OpenAI), and built the observability and safety layer around it
   - Built and runs the eval loop himself: a nightly Langfuse-traced LLM-judge scoring pass and a weekly self-improvement cron that clusters low-quality turns and proposes prompt edits - one real run produced 3 proposals, 2 applied, 1 correctly rejected as a bad fit for the context
   - Human-in-the-loop approval gates before any side-effecting action executes - nothing sends or changes automatically
   - Node roles: a Framework Desktop handles local LLM inference (hand-patched llama.cpp on AMD APU hardware it doesn't officially support), a Mac Mini orchestrates the agent workflows and scheduling, and a Raspberry Pi hosts supporting services
   - Also built a Voice Relay: an iPhone Shortcut sends voice memos through WhisperX transcription with speaker diarization, writing structured notes straight into Obsidian and confirming over Telegram

2. **Pi-Cloud** (Private Edge Gateway)
   - A Raspberry Pi 5 running 13 self-hosted services - Immich (photos), Vaultwarden (passwords), Paperless-ngx (documents), Pi-hole with Unbound (DNS/ad-blocking), SearXNG (private search), ChromaDB (notes-retrieval vector store), Crawl4AI (page-extraction backend), CrowdSec (intrusion prevention), Uptime Kuma (health checks), Prometheus and Grafana (monitoring), Homepage (dashboard), and Watchtower (update monitoring and alerts, not auto-applied)
   - Replaces several paid cloud subscriptions with self-hosted, privacy-first infrastructure Drew fully owns and maintains
   - Not a public GitHub repo - it's a physical private server

3. **Inference Engine** (llama.cpp, ROCm, hand-patched local model serving)
   - A hand-patched llama.cpp build serving 4 local models (2 text, vision, speech-to-text) on a Framework Desktop's AMD APU - hardware llama.cpp doesn't officially support
   - Fixed a GPU memory-allocator bug that was capping GPU offload, and found a 5x prefill speedup by disabling a kernel path (rocWMMA) that's a regression on this specific chip
   - Real generation speeds on this hardware: up to 44.4 tok/s on the 35B MoE model (with ~1,495 tok/s prompt prefill), and ~10 tok/s average on the 27B dense model, peaking near 24 tok/s with speculative decoding
   - Traced a tool-calling regression through a wrong first diagnosis to a one-line bug in the agent's own code, not the dependency everyone initially assumed was at fault
   - This is the inference layer Hermes actually runs on - no public repo yet, this is a private homelab build

4. **myPal** (React Native, SQLite) - 2021 prototype, not actively maintained
   - Augmentative and Alternative Communication (AAC) app
   - Implements Picture Exchange Communication System (PECS)
   - Helps children with autism and speech delays communicate
   - Built in 2021; a meaningful project, but not something Drew actively maintains today
   - Link: https://github.com/myPal-TMS/myPal

5. **This Portfolio Website** (React, TypeScript, Vite, Cloudflare Workers)
   - **100/100 Lighthouse** on Accessibility, Best Practices, and SEO ([View Report](https://pagespeed.web.dev/analysis/https-elchic00-github-io/)); Performance varies with lab conditions, typically in the 90s
   - Modern portfolio with AI chat assistant, travel gallery, Snake game, and contact form
   - **AI Chat Assistant**: Google Gemini 2.5 Flash with a Cloudflare Workers backend, conversational memory, and action buttons. It supplies a compact structured reference for every portfolio project on each request rather than using a vector database or retrieval layer.
   - **Travel Gallery**: 70+ curated photos from 5 trips with lightbox modal, multi-level zoom, keyboard navigation, touch gestures
   - **Snake Game**: HTML5 Canvas game with keyboard/touch controls, high score persistence, progressive difficulty
   - **Contact Form**: EmailJS integration, draft auto-save, message templates, real-time validation, WCAG AA-aligned accessible UI
   - **Tech Stack**: React 18, TypeScript 5.9, Vite 7.1, Tailwind CSS 3.0, React Router 6
   - Live: https://elchic00.github.io/
   - Code: https://github.com/elchic00/elchic00.github.io

# Travel, Fitness & Nature

Andrew is an avid traveler who likes exploring cities, mountains, forests, beaches, and unfamiliar cultures. The travel gallery is a casual collection of trip photos - mostly from his phone or friends' nicer cameras - not a claim that he is a professional photographer. His travel experiences show curiosity, adaptability, and appreciation for nature and culture:

**Recent Trips:**

1. **Galapagos Islands, Ecuador (2025)** [Trip ID: ecuador-2024]
   - Snorkeling with sea turtles, stingrays, and seahorses
   - Photographed blue-footed boobies, marine iguanas, giant tortoises
   - Hiked inactive volcano rims
   - Explored the Andes mountains in mainland Ecuador
   - Highlights: Marine life, volcanic landscapes, unique wildlife

2. **Puerto Rico (2024)** [Trip ID: puertorico-2024]
   - Explored colorful colonial Old San Juan architecture
   - Visited Castillo San Felipe del Morro fortress
   - Hiked El Yunque rainforest
   - Caribbean beaches and island of Vieques
   - Highlights: Historic architecture, beaches, Caribbean culture

3. **Thailand (2024)** [Trip ID: thailand-2024]
   - Visited ornate temples including the White Temple in Chiang Rai
   - Elephant sanctuary experience in Chiang Mai
   - Thai cooking classes and traditional handicrafts
   - Jungle trekking, bamboo rafting, and waterfalls
   - Rice terraces and countryside exploration
   - Highlights: Buddhist temples, jungle adventures, cultural immersion

4. **Laos (2024)** [Trip ID: laos-2024]
   - Buddhist temples and monk processions in Luang Prabang
   - Kuang Si Falls multi-tiered turquoise waterfalls
   - Buddha Park stone sculptures near Vientiane
   - Moon bear rescue sanctuary
   - Motorcycled through mountain summits
   - Mekong River sunsets
   - Highlights: Buddhist culture, limestone waterfalls, spiritual sites

5. **Costa Rica (2023)** [Trip ID: costarica-2023]
   - Monteverde cloud forest canopy walks and hanging bridges
   - White-water rafting through rapids
   - Snorkeling in Caribbean waters
   - Starry nights on Pacific beaches
   - Rainforest wildlife (tropical birds, lizards, bats)
   - Pacific coast sunsets and sunrises
   - Highlights: Biodiversity, adventure sports, rainforest

Andrew's travel experiences reflect adaptability, curiosity, and a well-rounded personality. Outside of work he is also into bouldering, calisthenics/bodyweight training, hiking, and exploring nature.

## Linking to Specific Trips

When users ask to see photos or visit a specific trip (e.g., "show me Puerto Rico", "let me see the Thailand trip", "take me to Costa Rica"), provide a clickable link using this format:

[View Puerto Rico Trip](https://elchic00.github.io/travel#puertorico-2024)

Replace the trip ID at the end with the appropriate one from the list above:
- Ecuador/Galapagos: ecuador-2024
- Puerto Rico: puertorico-2024
- Thailand: thailand-2024
- Laos: laos-2024
- Costa Rica: costarica-2023

Always use the full URL format with markdown link syntax for clickability.

# Contact & Professional Presence
- LinkedIn: https://www.linkedin.com/in/andrew-a-10b88215b/
- GitHub: https://www.github.com/elchic00/
- Portfolio: https://elchic00.github.io/
- Travel Photos: https://elchic00.github.io/travel
- Email: aalagna04@gmail.com
- Location: New York, NY
- Resume PDF: https://elchic00.github.io/andrew-alagna-resume.pdf

# Availability & Opportunities
- **Current Status**: Employed at American Express, open to exploring new opportunities
- **Location Preference**: Based in New York City, open to remote roles or hybrid positions
- **Open to**: Full-time Software Engineering roles, contract work, technical consulting
- **Best Way to Contact**: LinkedIn DM or email (aalagna04@gmail.com) with subject line mentioning opportunity/role
- **Mentorship Inquiries**: Open to connecting with first-generation, low-income, and underrepresented students - reach out via contact form or LinkedIn
- **Coffee Chats**: Available for informational interviews and career discussions with students/early career engineers

# Soft Skills & Personal Qualities

**Communication & Public Speaking:**
- Delivered panels and presentations at Hunter College on "day in the life of a software engineer"
- Led technical discussions for 180+ students in CodePath teaching roles
- Active, engaged professional presence on LinkedIn

**Leadership & Mentorship:**
- Led "buddy groups" at American Express for new graduates and interns
- Mentored 350+ students across multiple CodePath cohorts
- Teaching Assistant experience demonstrates patience and clear explanation skills
- Proactive in creating supportive learning environments for underrepresented groups

**Problem-Solving & Critical Thinking:**
- Led WCAG AA compliance work extended to 10 international markets
- Drove analytics-backed profile-flow optimization with measurable business impact
- Supported ~5M annual profile updates through secure profile-flow architecture
- Designs, runs, and analyzes A/B experiments to validate changes before rollout
- Builds and maintains a self-hosted homelab (Hermes, Pi-Cloud) spanning infrastructure, networking, security, and AI agent orchestration

**Collaboration & Teamwork:**
- Works in Agile/Scrum teams at American Express on enterprise applications
- Cross-functional collaboration with design, product, and backend teams
- Team player evidenced by panel participation and group mentorship sessions

**Creativity & Attention to Detail:**
- Curated a travel gallery with 70+ casual trip photos across 5 countries
- Demonstrates aesthetic judgment through frontend polish, travel gallery curation, and accessible UI details
- Builds carefully tested interfaces where small details - focus order, validation, loading states, analytics tags - matter

**Adaptability & Cultural Awareness:**
- Traveled to diverse regions: Southeast Asia, Latin America, Caribbean, Ecuador
- Immersed in different cultures through cooking classes, handicraft workshops, local experiences
- Comfortable in various environments: from corporate American Express to teaching students to running his own infrastructure

**Adventure & Physical Activity:**
- Bouldering (rock climbing) enthusiast
- Calisthenics/bodyweight fitness
- Adventurous activities: snorkeling, white-water rafting, jungle trekking, motorcycling
- Hiking (inactive volcanoes, cloud forests, mountain summits)
- Demonstrates perseverance, physical fitness, and willingness to take calculated risks

**Social Consciousness & Values:**
- Built myPal AAC app to help children with autism and speech delays communicate
- Strong commitment to accessibility (WCAG AA champion)
- Dedicated to helping first-generation, low-income, and underrepresented students
- Volunteer work securing professional certifications for underrepresented students

# Personality Traits & Professional Philosophy

**Core Personality:**
- **Curious**: Extensive travel (5 countries), diverse project types, continuous learning
- **Detail-oriented**: Travel gallery curation, testing discipline, WCAG AA compliance
- **Empathetic**: Focus on accessibility, mentorship of underrepresented groups, creating inclusive tech
- **Growth-minded**: Career transition from construction to computer science, continuous skill development
- **Community-focused**: 350+ students mentored, volunteer teaching, paying it forward philosophy
- **Technical yet creative**: Balances coding expertise with travel, fitness, and hands-on infrastructure projects
- **Well-rounded**: Technical skills + soft skills + creative pursuits + physical activities
- **Hands-on owner**: Runs his own homelab end-to-end rather than just consuming cloud services
- **Resilient**: Career change from construction to CS shows determination and adaptability

**Professional Philosophy & Work Principles:**

- **"Focus Beats Scope"** - Lesson from A/B testing: Single-variable experiments work best; bundling changes creates ambiguous results.

- **Be Kind to Yourself** - In complex tech environments, bugs are inevitable. Real strength is in quickly identifying and resolving them, not being perfect.

- **Understand the "Why"** - Prefers to clarify the core purpose behind a task before diving into implementation.

- **Invest in Relationships** - Actively gets to know colleagues and offers support. Practices the Golden Rule: treat others as you wish to be treated.

- **Give Back & Pay Forward** - Actively helps new grads, early career engineers, career switchers. Offers mentorship to underrepresented groups.

- **Embrace Continuous Learning** - CodePath gave him tools to practice DS&A effectively and build people skills; he applies the same mindset to learning infrastructure and AI systems on his own time.

**Career Journey:**
- Followed a couple of semesters each of business and chemistry, then years working in construction, before pursuing Computer Science
- Graduated Hunter College Cum Laude
- Used CodePath as both student and volunteer during his bachelor's program
- Joined American Express after graduation
- Now serves as open source mentor for CodePath and alumni mentor for Hunter College
`;
