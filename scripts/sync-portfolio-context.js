#!/usr/bin/env node

/**
 * Syncs portfolio context from src/data/context/ to worker/index.js
 * Reads the three source TypeScript files and combines them into worker
 */

const fs = require('fs');
const path = require('path');

const SYSTEM_PROMPT_FILE = path.join(__dirname, '../src/data/context/systemPrompt.ts');
const BIOGRAPHY_FILE = path.join(__dirname, '../src/data/context/biography.ts');
const SKILLS_FILE = path.join(__dirname, '../src/data/context/skills.ts');
const WORKER_FILE = path.join(__dirname, '../worker/index.js');

console.log('🔄 Syncing portfolio context...');

/**
 * Extracts the exported const string from a TypeScript file
 * @param {string} filePath - Path to the TypeScript file
 * @param {string} constName - Name of the constant to extract
 * @returns {string} - The extracted string value
 */
function extractConstFromFile(filePath, constName) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Match: export const CONST_NAME = `...`;
  const regex = new RegExp(`export const ${constName} = \`([\\s\\S]*?)\`;`, 'm');
  const match = content.match(regex);

  if (!match) {
    console.error(`❌ Could not find "export const ${constName}" in ${filePath}`);
    process.exit(1);
  }

  return match[1];
}

// Extract the three context components
const systemPrompt = extractConstFromFile(SYSTEM_PROMPT_FILE, 'SYSTEM_PROMPT');
const biography = extractConstFromFile(BIOGRAPHY_FILE, 'BIOGRAPHY');
const skills = extractConstFromFile(SKILLS_FILE, 'SKILLS');

// Combine them with the same structure as index.ts
const portfolioContext = `${systemPrompt}

${biography}

${skills}`;

// Read the worker file
let workerContent = fs.readFileSync(WORKER_FILE, 'utf8');

// Replace the PORTFOLIO_CONTEXT in worker file
const workerContextRegex = /const PORTFOLIO_CONTEXT = `[\s\S]*?`;/;

const replacement = `const PORTFOLIO_CONTEXT = \`${portfolioContext}\`;`;

if (!workerContextRegex.test(workerContent)) {
  console.error('❌ Could not find PORTFOLIO_CONTEXT in worker file');
  process.exit(1);
}

workerContent = workerContent.replace(workerContextRegex, replacement);

// Write back to worker file
fs.writeFileSync(WORKER_FILE, workerContent, 'utf8');

console.log('✅ Portfolio context synced successfully!');
console.log(`   System Prompt: ${SYSTEM_PROMPT_FILE}`);
console.log(`   Biography: ${BIOGRAPHY_FILE}`);
console.log(`   Skills: ${SKILLS_FILE}`);
console.log(`   Target: ${WORKER_FILE}`);
console.log(`   Total context size: ${portfolioContext.length} characters`);
