# 👋 Andrew Alagna - Software Engineer Portfolio

**Welcome to my corner of the internet!** I'm Andrew Alagna, a Software Engineer at American Express who loves building accessible, user-friendly web applications. This portfolio showcases my work, shares my travel photography, features an AI chat assistant, and yes... you can play Snake. 🐍

[![Live Site](https://img.shields.io/badge/Live-elchic00.github.io-blue?style=for-the-badge)](https://elchic00.github.io)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/andrew-a-10b88215b/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/elchic00)

---

## 🌟 Features

### 💼 Professional Work & Experience

- **Experience Timeline** - Professional journey at American Express + mentorship roles
- **6 Featured Projects** - Full-stack applications showcasing React, Python, TypeScript, and more
- **Skills Matrix** - Technical skills organized by category with interactive tooltips
- **Resume** - Downloadable PDF with complete work history

### 🤖 AI Chat Assistant

- **Interactive AI-powered chat** answering questions about my experience, projects, and skills
- **Powered by Google Gemini 2.5 Flash** with secure Cloudflare Workers backend
- **Rate-limited and optimized** for natural conversations (free tier: 1,500 req/day)
- **Action buttons** - Navigate to sections, download resume, open LinkedIn
- **Conversational memory** - Remembers context for better responses

[📖 AI Chat Documentation](docs/AI_CHAT.md)

### 🌍 Travel Photography Gallery

- **Interactive photo galleries** from adventures around the world
- **5 major trips** - Ecuador/Galapagos, Puerto Rico, Thailand, Laos, Costa Rica
- **70+ curated photos** - Wildlife, landscapes, and cultural moments
- **Lightbox modal** with keyboard navigation (←/→ arrows, ESC to close)
- **Zoom functionality** - Click to zoom in on details
- **Touch-optimized** - Swipe gestures for mobile devices

### 🎮 Snake Game

- **Fully functional retro game** built with HTML5 Canvas
- **Keyboard controls** - Arrow keys or WASD, Space to pause
- **Touch controls** - Swipe gestures for mobile
- **High score persistence** - Saved to localStorage
- **Progressive difficulty** - Speed increases as you score

[🎮 Play Snake](https://elchic00.github.io/#/snake)

### 📬 Contact Form

- **EmailJS integration** - Serverless email delivery
- **Real-time validation** - Name, email, message with error messages
- **Mailto fallback** - Alternative for VPN/firewall issues
- **Accessibility** - WCAG AAA compliant with proper ARIA labels
- **Loading states** - Visual feedback during submission

### ⚡ Performance & Accessibility

- **WCAG AAA Compliance** - Semantic HTML, ARIA labels, keyboard navigation
- **Lighthouse Score: 95+** - Optimized for performance across all metrics
- **Lazy Loading** - Code splitting and lazy-loaded routes
- **Responsive Design** - Mobile-first with Tailwind CSS
- **SEO Optimized** - Schema.org structured data, image sitemap
- **Scroll Animations** - Intersection Observer for smooth reveals

---

## 🛠️ Tech Stack

### Frontend
- **[React 18](https://reactjs.org/)** - UI framework with hooks and TypeScript
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite 7.1](https://vitejs.dev/)** - Next-generation build tool with HMR
- **[Tailwind CSS 3.0](https://tailwindcss.com/)** - Utility-first styling
- **[React Router 6](https://reactrouter.com/)** - Client-side routing with hash support

### Backend & APIs
- **[Google Gemini 2.5 Flash](https://ai.google.dev/)** - AI chat assistant
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Serverless API proxy
- **[EmailJS](https://www.emailjs.com/)** - Contact form email delivery

### Development & Build
- **[ESLint + TypeScript](https://typescript-eslint.io/)** - Code quality and type checking
- **[PostCSS + Autoprefixer](https://postcss.org/)** - CSS processing
- **[Sharp](https://sharp.pixelplumbing.com/)** - Image optimization scripts

### Deployment & Hosting
- **[GitHub Pages](https://pages.github.com/)** - Static site hosting
- **[Wrangler](https://developers.cloudflare.com/workers/wrangler/)** - Cloudflare Workers CLI
- **[gh-pages](https://www.npmjs.com/package/gh-pages)** - Automated deployment

### Additional Libraries
- **[Heroicons](https://heroicons.com/)** - Beautiful SVG icons
- **[marked](https://marked.js.org/)** - Markdown parser for AI chat
- **[DOMPurify](https://github.com/cure53/DOMPurify)** - XSS sanitization

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** and npm
- **Git** for version control
- **(Optional)** Cloudflare account for AI chat deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/elchic00/elchic00.github.io.git

# Navigate to the project
cd elchic00.github.io

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000 in your browser
```

### Environment Variables

Create a `.env.local` file:

```bash
VITE_EMAIL_SERVICE_ID=your_emailjs_service_id
VITE_EMAIL_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAIL_PUBLIC_KEY=your_emailjs_public_key
```

Get EmailJS credentials at [emailjs.com](https://www.emailjs.com/)

---

## 📂 Project Structure

```
elchic00.github.io/
├── public/
│   ├── images/
│   │   ├── projects/           # Project screenshots
│   │   └── travel/             # Travel photography (70+ photos)
│   ├── andrew-alagna-resume.pdf
│   ├── sitemap.xml             # SEO sitemap
│   └── image-sitemap.xml       # Image SEO
├── src/
│   ├── components/
│   │   ├── AIChatAssistant/    # AI chat (8 subcomponents)
│   │   │   ├── AIChatAssistant.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── SuggestedQuestions.tsx
│   │   │   ├── LoadingIndicator.tsx
│   │   │   ├── types.ts
│   │   │   ├── utils.ts
│   │   │   └── index.ts
│   │   ├── Travel/             # Gallery components
│   │   │   ├── TripCard.tsx
│   │   │   ├── TripNavigation.tsx
│   │   │   └── PhotoGallery.tsx
│   │   ├── shared/             # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── SocialLinks.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── ...
│   │   ├── About.tsx
│   │   ├── Contact.tsx         # Contact form
│   │   ├── Experience.tsx      # Work timeline
│   │   ├── Projects.tsx        # Project showcase
│   │   ├── Skills.tsx          # Skills matrix
│   │   ├── Travel.tsx          # Travel gallery
│   │   ├── Snake.tsx           # Snake game
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── index.ts            # 7 general hooks
│   │   ├── useSnakeGame.ts     # Game logic (308 lines)
│   │   ├── useActiveTrip.ts    # Gallery navigation
│   │   └── useContactForm.ts   # Form management (203 lines)
│   ├── data/
│   │   ├── portfolioContext.ts # AI chat knowledge base (600+ lines)
│   │   ├── projects.json       # Project data
│   │   ├── skills.json         # Skills data
│   │   ├── trips.json          # Travel data
│   │   └── skillTooltips.ts    # Skill descriptions
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   ├── constants/
│   │   └── index.ts            # App configuration
│   ├── utils/
│   │   └── generateTravelStructuredData.ts
│   ├── pages/
│   │   └── HomePage.tsx
│   ├── App.tsx
│   ├── routes.tsx              # Route configuration
│   ├── index.tsx               # Entry point
│   └── index.css               # Global styles
├── worker/
│   └── index.js                # Cloudflare Worker for AI chat
├── scripts/
│   ├── sync-portfolio-context.js  # Sync AI context
│   ├── optimize-images.js         # WebP conversion
│   ├── generate-logos.js          # Favicon generation
│   └── compress-videos.js         # Video optimization
├── docs/
│   ├── AI_CHAT.md              # AI chat setup guide
│   └── HOOKS.md                # Custom hooks documentation
├── package.json
├── vite.config.ts
├── wrangler.toml               # Cloudflare configuration
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🎯 Available Scripts

### Development

```bash
npm start              # Start Vite dev server (port 3000)
npm run dev            # Same as npm start
npm run worker:dev     # Run Cloudflare Worker locally
```

### Build & Deploy

```bash
npm run build          # Build for production (TypeScript + Vite)
npm run preview        # Preview production build locally
npm run deploy         # Deploy to GitHub Pages
npm run worker:deploy  # Deploy AI chat worker to Cloudflare
```

### Utilities

```bash
npm run sync-context      # Sync AI portfolio context to worker
npm run optimize-images   # Convert images to WebP format
npm run generate-logos    # Generate favicon variants
```

---

## 🤖 AI Chat Setup

The AI chat assistant requires minimal setup:

### 1. Get API Key

Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API key.

### 2. Login to Cloudflare

```bash
npx wrangler login
```

### 3. Set API Key as Secret

```bash
npx wrangler secret put GEMINI_API_KEY
# Paste your API key when prompted
```

### 4. Deploy Worker

```bash
npm run worker:deploy
```

**That's it!** The AI chat is now live on your site.

For detailed setup, troubleshooting, and customization, see [docs/AI_CHAT.md](docs/AI_CHAT.md).

---

## 📚 Documentation

- **[AI Chat Guide](docs/AI_CHAT.md)** - Complete setup, customization, and troubleshooting
- **[Custom Hooks](docs/HOOKS.md)** - Documentation for 11 reusable React hooks
- **[Image Optimization](docs/IMAGE_OPTIMIZATION.md)** - Guide for optimizing photos

---

## ✨ Key Features Breakdown

### 1. **Modular Architecture**

Components are organized by feature with clear separation of concerns:

```
components/
├── AIChatAssistant/    # 8 focused sub-components
├── Travel/             # 3 gallery components
└── shared/             # 6 reusable UI components
```

### 2. **Custom React Hooks** (11 Total)

Encapsulate complex logic for reusability:

- `useLocalStorage` - State persistence
- `useFormValidation` - Form management with validation
- `useAsync` - Async operation handling
- `useSnakeGame` - Complete game logic (308 lines!)
- `useContactForm` - Contact form + email sending (203 lines)
- And 6 more utility hooks

[📖 View Full Hook Documentation](docs/HOOKS.md)

### 3. **Performance Optimizations**

- ⚡ **Code Splitting** - Lazy-loaded routes (Resume, Travel, Snake)
- ⚡ **Image Optimization** - WebP format with JPEG fallback
- ⚡ **Bundle Optimization** - Manual chunks for React, Router, Markdown
- ⚡ **Debouncing** - Window resize, form validation
- ⚡ **Lazy Loading** - Images and markdown library

### 4. **Accessibility (WCAG AAA)**

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Color contrast ratios
- ✅ Alt text for all images
- ✅ Form accessibility with aria-describedby

### 5. **SEO Optimization**

- Schema.org structured data (Person, ImageGallery, ImageObject)
- Image sitemap for Google Images
- Open Graph and Twitter Card meta tags
- Semantic URLs with hash routing
- Descriptive alt text and file names

---

## 🌐 Deployment

### Deploy Main Site

```bash
npm run deploy
```

This builds the site and deploys to GitHub Pages via the `gh-pages` branch.

### Deploy AI Chat Worker

```bash
npm run worker:deploy
```

This syncs the portfolio context and deploys to Cloudflare Workers.

### Custom Domain (Optional)

Add a `CNAME` file to `/public`:

```
yourdomain.com
```

Then configure DNS in your domain registrar.

---

## 📸 Featured Projects

### 🏋️ **Reps** - Technical Interview Prep

Mobile-first app with React Native + web version for daily coding challenges.
[🔗 Live Demo](https://reps-pink.vercel.app/)

### 👨‍🏫 **myTeachers** - Education Platform

Student management system with React, Express, PostgreSQL, and Firebase auth.
[📂 View Code](https://github.com/elchic00/CunyFirst-front)

### 🍎 **Macros-for-geeks** - Nutrition Tracker

Food diary app built with Angular, .NET, and SQLite, integrating USDA FoodData API.
[📂 View Code](https://github.com/elchic00/Macros-for-geeks)

### 📊 **Crime in Queens NYC** - Data Visualization

Python data analysis with interactive visualizations using Pandas and Matplotlib.
[🔗 Live Demo](https://elchic00.github.io/CrimeInQueens)

### 🏢 **Invent0ry** - AWS Inventory Management

Full-stack inventory tracking with React and AWS Amplify.
[📂 View Code](https://github.com/elchic00/invent0ry)

### 🗣️ **myPal** - AAC Mobile App

React Native communication app for children with special needs using PECS.
[📂 View Code](https://github.com/myPal-TMS/myPal)

[**→ View All Projects Live**](https://elchic00.github.io/#projects)

---

## 🌍 Travel Photography

Explore my [travel photo galleries](https://elchic00.github.io/#/travel) featuring:

- 🇪🇨 **Ecuador/Galapagos (2025)** - Marine life, tortoises, volcanic landscapes
- 🇵🇷 **Puerto Rico (2024)** - Colonial architecture, El Yunque rainforest
- 🇹🇭 **Thailand (2024)** - Temples, elephant sanctuaries, jungle trekking
- 🇱🇦 **Laos (2024)** - Buddhist culture, Kuang Si Falls, Mekong River
- 🇨🇷 **Costa Rica (2023)** - Cloud forests, white-water rafting, wildlife

**70+ curated photos** with interactive lightbox and keyboard navigation.

---

## 🤝 Contributing

This is a personal portfolio, but feel free to:

- ⭐ **Star this repo** if you find it helpful
- 🍴 **Fork it** as inspiration for your own portfolio
- 🐛 **Report issues** via GitHub Issues
- 💡 **Suggest improvements** via Pull Requests

If you use this code, I'd love to see what you create - drop me a link!

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **React Team** - For an amazing framework
- **Tailwind CSS** - Making styling actually enjoyable
- **Google Gemini** - Powerful free AI API
- **Cloudflare** - Generous Workers free tier
- **Open Source Community** - Endless inspiration
- **CUNY Hunter College** - Education foundation
- **CodePath** - Teaching and mentorship opportunities

---

## 🤝 Let's Connect!

I'm always open to interesting conversations about:

- 💻 Software engineering and web development
- 🎨 UI/UX design and accessibility
- 🤖 AI integration and serverless architecture
- 🌏 Travel and photography
- 🚀 New opportunities and collaborations

**Find me on:**

- 🌐 Portfolio: [elchic00.github.io](https://elchic00.github.io)
- 💼 LinkedIn: [Andrew Alagna](https://www.linkedin.com/in/andrew-a-10b88215b/)
- 🐙 GitHub: [@elchic00](https://github.com/elchic00)
- 📧 Email: Via [contact form](https://elchic00.github.io/#contact)

---

## 💡 What This Project Demonstrates

For recruiters and potential employers:

### Frontend Engineering
- ✅ React 18 with TypeScript and modern hooks
- ✅ Component architecture with proper separation of concerns
- ✅ Custom hook library (11 hooks, 876 lines of reusable code)
- ✅ Responsive design with mobile-first approach
- ✅ Performance optimization (lazy loading, code splitting)

### Full-Stack Capabilities
- ✅ Serverless backend with Cloudflare Workers
- ✅ API integration (Google Gemini, EmailJS)
- ✅ Secure secrets management
- ✅ Rate limiting and error handling

### Accessibility & UX
- ✅ WCAG AAA compliance throughout
- ✅ Keyboard navigation support
- ✅ Screen reader optimization
- ✅ Focus management in modals
- ✅ Semantic HTML and ARIA labels

### DevOps & Tooling
- ✅ CI/CD with GitHub Actions
- ✅ Automated deployment scripts
- ✅ Image optimization pipeline
- ✅ Environment variable management
- ✅ TypeScript for type safety

### Software Engineering Practices
- ✅ Modular, maintainable architecture
- ✅ Comprehensive documentation
- ✅ Git best practices
- ✅ Code reusability
- ✅ Performance monitoring

---

<div align="center">

**Built with ❤️ by Andrew Alagna**

⭐ Star this repo if you find it helpful!

[🌐 Visit Live Site](https://elchic00.github.io) | [📧 Get in Touch](https://elchic00.github.io/#contact) | [📖 Documentation](docs/)

</div>
