#!/usr/bin/env node

/**
 * Syncs portfolio context from src/data/context/index.ts to worker/index.js
 * This ensures both files always have the same content
 */

const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, '../src/data/context/index.ts');
const WORKER_FILE = path.join(__dirname, '../worker/index.js');

console.log('🔄 Syncing portfolio context...');

// Read the source TypeScript file
const sourceContent = fs.readFileSync(SOURCE_FILE, 'utf8');

// Extract the PORTFOLIO_CONTEXT string using regex
const contextMatch = sourceContent.match(/export const PORTFOLIO_CONTEXT = `([\s\S]*?)`;/);

if (!contextMatch) {
  console.error('❌ Could not find PORTFOLIO_CONTEXT in source file');
  process.exit(1);
}

const portfolioContext = contextMatch[1];

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
console.log(`   Source: ${SOURCE_FILE}`);
console.log(`   Target: ${WORKER_FILE}`);
