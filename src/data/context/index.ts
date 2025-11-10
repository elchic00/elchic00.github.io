/**
 * Portfolio Context - Combined AI Assistant Context
 * Combines biography, skills, and system prompt into single context string
 *
 * NOTE: To sync this context to worker/index.js, run: npm run sync-context
 * This ensures single source of truth for the chatbot
 */

import { SYSTEM_PROMPT } from './systemPrompt';
import { BIOGRAPHY } from './biography';
import { SKILLS } from './skills';

/**
 * Complete context for the AI chatbot assistant
 * Combines system instructions, biographical information, and technical skills
 */
export const PORTFOLIO_CONTEXT = `${SYSTEM_PROMPT}

${BIOGRAPHY}

${SKILLS}`;
