#!/usr/bin/env node

/**
 * Syncs portfolio context from src/data/context/ and public/knowledge/projects.json to worker/index.js
 * Reads the source files and combines them into the Worker with a complete project reference sheet
 */

const fs = require('fs');
const path = require('path');

const SYSTEM_PROMPT_FILE = path.join(__dirname, '../src/data/context/systemPrompt.ts');
const BIOGRAPHY_FILE = path.join(__dirname, '../src/data/context/biography.ts');
const SKILLS_FILE = path.join(__dirname, '../src/data/context/skills.ts');
const PROJECTS_JSON_FILE = path.join(__dirname, '../public/knowledge/projects.json');
const WORKER_FILE = path.join(__dirname, '../worker/index.js');

console.log('🔄 Syncing portfolio context...');

function extractConstFromFile(filePath, constName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = new RegExp(`export const ${constName} = \`([\\s\\S]*?)\`;`, 'm');
  const match = content.match(regex);
  if (!match) {
    console.error(`❌ Could not find "export const ${constName}" in ${filePath}`);
    process.exit(1);
  }
  return match[1];
}

function formatProjectsContext(projectsJsonPath) {
  try {
    const projectsData = fs.readFileSync(projectsJsonPath, 'utf8');
    const projects = JSON.parse(projectsData);
    const chunks = projects.map(project => {
      const keywords = [
        project.id,
        project.title.toLowerCase(),
        ...(project.technologies || []),
        ...(project.subtitle ? project.subtitle.toLowerCase().split(/[^\w]+/) : [])
      ].filter(Boolean);
      return {
        id: project.id,
        title: project.title,
        subtitle: project.subtitle || '',
        description: project.description,
        technologies: project.technologies || [],
        link: project.link,
        keywords: keywords
      };
    });
    return JSON.stringify(chunks, null, 2);
  } catch (e) {
    console.error(`❌ Failed to load projects.json: ${e.message}`);
    process.exit(1);
  }
}

const systemPrompt = extractConstFromFile(SYSTEM_PROMPT_FILE, 'SYSTEM_PROMPT');
const biography = extractConstFromFile(BIOGRAPHY_FILE, 'BIOGRAPHY');
const skills = extractConstFromFile(SKILLS_FILE, 'SKILLS');
const projectsContext = formatProjectsContext(PROJECTS_JSON_FILE);
const portfolioContext = `${systemPrompt}\n\n${biography}\n\n${skills}`;
let workerContent = fs.readFileSync(WORKER_FILE, 'utf8');
const workerContextRegex = /const PORTFOLIO_CONTEXT = `[\s\S]*?`;/;
const replacement = `const PORTFOLIO_CONTEXT = \`${portfolioContext}\`;`;
if (!workerContextRegex.test(workerContent)) {
  console.error('❌ Could not find PORTFOLIO_CONTEXT in worker file');
  process.exit(1);
}
workerContent = workerContent.replace(workerContextRegex, replacement);
const projectsDataRegex = /const PROJECTS_CONTEXT_DATA = `[\s\S]*?`;/;
const projectsReplacement = `const PROJECTS_CONTEXT_DATA = \`${projectsContext}\`;`;
if (projectsDataRegex.test(workerContent)) {
  workerContent = workerContent.replace(projectsDataRegex, projectsReplacement);
} else {
  workerContent = workerContent.replace(
    replacement,
    `${replacement}\n\n// Complete structured project reference sheet for each chat request\nconst PROJECTS_CONTEXT_DATA = \`${projectsContext}\`;`
  );
}
fs.writeFileSync(WORKER_FILE, workerContent, 'utf8');
console.log('✅ Portfolio context synced successfully!');
console.log(`   Projects indexed: ${JSON.parse(projectsContext).length} projects`);
