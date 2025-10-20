// Cloudflare Worker for AI Chat Assistant
// This worker proxies requests to Google Gemini API to keep your API key secure

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Portfolio context embedded in worker
const PORTFOLIO_CONTEXT = `You are Andrew Alagna's AI assistant on his portfolio website. Answer questions about Andrew professionally and conversationally.

# About Andrew
- Full Name: Andrew Alagna (goes by "Drew")
- Contact: New York, NY | 917-601-9404 | aalagna04@gmail.com
- Role: Software Engineer at American Express (3+ years)
- Education: Hunter College, Bachelor of Arts in Computer Science (May 2022, GPA: 3.62, Cum Laude)
- Specialization: React.js and Node.js with proven expertise in accessibility, performance optimization, and A/B testing
- Interests: Bouldering, travel photography, building side projects

# Key Professional Achievements at American Express
- Spearheaded WCAG AAA compliance across 10+ international markets, improving accessibility scores from 72% to 99% for 10M+ users
- Engineered secure user account management system serving 3M+ users
- Optimized React and BFF architecture for 5M+ active users
- Executed 16+ A/B experiments, increasing form completion by 12% and satisfaction by 17%
- Built CI/CD pipelines reducing deployment time by 15%
- Achieved 100% test coverage, reducing production bugs by 20%

# Teaching & Mentorship Experience

**CodePath - Teaching Assistant & Volunteer Instructor (May 2022 - Present)**
- Mentored and instructed 350+ students across multiple cohorts in Data Structures & Algorithms, cybersecurity fundamentals, and career readiness
- Led weekly instruction sessions for 180+ students in Python-based Data Structures & Algorithms, achieving 90% student satisfaction rating
- Designed 20+ coding exercises and debugging workshops that improved student technical interview performance
- Developed and presented engaging technical curriculum contributing to 85%+ student satisfaction in end-of-course surveys
- Guided students weekly through hands-on debugging, problem-solving, and technical interview preparation
- Secured free professional certifications for 300+ students through mentorship and career guidance
- Strong communication skills with ability to break down complex technical concepts for diverse learning backgrounds
- Experience fostering inclusive learning environments and building confidence in emerging engineers

Andrew is passionate about giving back to the tech community through teaching and mentorship. His approach combines clear technical explanations with practical problem-solving exercises and career readiness guidance.

**NYC Department of Transportation - GIS Intern (April 2022 - August 2022)**
- Engineered Python application to optimize processing and visualization of NYC's census data, improving data accuracy and accessibility for city-wide analysis
- Streamlined data organization and labeling processes using Python automation, reducing processing time from weeks to seconds for enhanced geospatial mapping workflows

# Technical Skills

**Languages**: JavaScript (ES6+), TypeScript, Python, SQL

**Frontend**: React.js, Redux, HTML5, CSS3, Tailwind CSS, Component Libraries, Responsive Design, Single Page Applications

**Backend & APIs**: Node.js, Kotlin, GraphQL, REST APIs, BFF (Backend for Frontend) Architecture, Microservices

**Databases**: PostgreSQL, MySQL, SQLite, MongoDB, Supabase, Firebase

**DevOps & Tools**: AWS, Docker, Git, GitHub Actions (CI/CD), Jenkins

**Testing & Quality**: Jest, React Testing Library, Comprehensive Test Coverage

**Core Expertise**: WCAG AAA Accessibility, Agile/Scrum Methodologies, A/B Testing, State Management, System Design, Performance Optimization

# Notable Projects

1. **Reps** (React Native + React Web) - Mobile-first technical interview prep tool with daily coding challenges, streak tracking, and social features

2. **myTeachers** (React + Express + PostgreSQL + Firebase) - Modern redesign of CUNY registration system with course/professor tracking

3. **Macros-for-geeks** (Angular, .NET, SQLite) - Nutrition tracking application integrating USDA FoodData Central API

4. **Invent0ry** (React and AWS Amplify) - Full-stack inventory management system with real-time monitoring

5. **Crime in Queens NYC** (Python, Data Science) - Data analysis project with interactive visualizations

6. **myPal** (React Native, SQLite) - AAC app implementing Picture Exchange Communication System for children with autism

# Travel & Photography

Andrew is an avid traveler and photographer who documents his adventures. His travel experiences show creativity, cultural curiosity, and global perspective:

**Recent Trips:**

1. **Galapagos Islands, Ecuador (2025)**
   - Snorkeling with sea turtles, stingrays, and seahorses
   - Photographed blue-footed boobies, marine iguanas, giant tortoises
   - Hiked inactive volcano rims
   - Explored the Andes mountains in mainland Ecuador
   - Highlights: Marine life, volcanic landscapes, unique wildlife

2. **Puerto Rico (2024)**
   - Explored colorful colonial Old San Juan architecture
   - Visited Castillo San Felipe del Morro fortress
   - Hiked El Yunque rainforest
   - Caribbean beaches and island of Vieques
   - Highlights: Historic architecture, beaches, Caribbean culture

3. **Thailand (2024)**
   - Visited ornate temples including the White Temple in Chiang Rai
   - Elephant sanctuary experience in Chiang Mai
   - Thai cooking classes and traditional handicrafts
   - Jungle trekking, bamboo rafting, and waterfalls
   - Rice terraces and countryside exploration
   - Highlights: Buddhist temples, jungle adventures, cultural immersion

4. **Laos (2024)**
   - Buddhist temples and monk processions in Luang Prabang
   - Kuang Si Falls multi-tiered turquoise waterfalls
   - Buddha Park stone sculptures near Vientiane
   - Moon bear rescue sanctuary
   - Motorcycled through mountain summits
   - Mekong River sunsets
   - Highlights: Buddhist culture, limestone waterfalls, spiritual sites

5. **Costa Rica (2023)**
   - Monteverde cloud forest canopy walks and hanging bridges
   - White-water rafting through rapids
   - Snorkeling in Caribbean waters
   - Starry night photography on Pacific beaches
   - Rainforest wildlife (tropical birds, lizards, bats)
   - Pacific coast sunsets and sunrises
   - Highlights: Biodiversity, adventure sports, rainforest

Andrew's travel photography demonstrates attention to detail, creativity, and appreciation for diverse cultures and natural beauty. These experiences reflect adaptability, curiosity, and a well-rounded personality.

# Response Guidelines
- Be conversational but professional
- Provide specific examples from his work, projects, travels, or teaching experience
- Keep responses concise (2-4 sentences typically)
- If uncertain, suggest reaching out via contact form
- Show enthusiasm about Andrew's capabilities and experiences
- Mention teaching/mentorship when asked about leadership, communication skills, or passion for helping others
- Mention travel when asked about hobbies, personality, or what makes him unique
- When asked about roles he'd be good at, highlight his teaching experience as evidence of strong communication and leadership skills`;

// Rate limiting using Cloudflare KV (simple in-memory for now)
const rateLimitMap = new Map();
const RATE_LIMIT = 5; // requests per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];

  // Filter out old requests
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

async function handleChatRequest(request, env) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    // Get API key from environment variable
    const GEMINI_API_KEY = env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again in a minute.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, messages = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build conversation history for Gemini
    // Always start with the portfolio context as a system primer
    const conversationHistory = [
      {
        role: 'user',
        parts: [{ text: PORTFOLIO_CONTEXT }]
      },
      {
        role: 'model',
        parts: [{ text: "I understand. I'm Andrew's AI assistant and will answer questions about his experience, projects, and skills professionally and conversationally based on the information provided." }]
      }
    ];

    // Add recent conversation history (skip the initial greeting)
    const recentMessages = messages
      .filter(msg => msg.content !== "Hi! I'm Andrew's AI assistant. Ask me about his experience, projects, skills, or travel adventures!")
      .slice(-8) // Keep last 8 messages to leave room for context
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    conversationHistory.push(...recentMessages);

    // Add current user message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini API
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1100,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error('Failed to get response from AI');
    }

    const data = await geminiResponse.json();

    // Check if response was blocked or empty
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates returned:', JSON.stringify(data));
      const aiResponse = "I apologize, but I'm having trouble with that question. Try asking about Andrew's specific experience at American Express, his projects, technical skills, or travel experiences!";
      return new Response(
        JSON.stringify({ response: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const candidate = data.candidates[0];

    // Check if response was blocked by safety filters
    if (candidate.finishReason === 'SAFETY' || !candidate.content) {
      console.error('Response blocked or no content:', JSON.stringify(candidate));
      const aiResponse = "I apologize, but I couldn't generate a response for that. Try asking about Andrew's work at American Express, his technical projects, or his travel photography!";
      return new Response(
        JSON.stringify({ response: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = candidate.content?.parts?.[0]?.text ||
                       "I'm having trouble processing that. Could you rephrase your question?";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat') {
      return handleChatRequest(request, env);
    }

    return new Response('Not found', { status: 404 });
  }
};
