import type { RAGChunk, SearchResult } from './rag-types';

// Simple hash-based embeddings - no API key needed, works offline
function generateEmbedding(text: string): number[] {
  const dimensions = 384;
  const embedding = new Array(dimensions).fill(0);
  const normalized = text.toLowerCase().trim();
  
  for (let i = 0; i < normalized.length - 2; i++) {
    const trigram = normalized.slice(i, i + 3);
    let hash = 0;
    for (let j = 0; j < trigram.length; j++) {
      hash = ((hash << 5) - hash) + trigram.charCodeAt(j);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % dimensions;
    embedding[index] += 1;
  }
  
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    return embedding.map(val => val / magnitude);
  }
  return embedding;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class ProjectRAG {
  private chunks: RAGChunk[] = [];
  private embeddings: Map<string, number[]> = new Map();
  private loaded = false;

  async load() {
    if (this.loaded) return;
    
    try {
      const response = await fetch('/knowledge/projects.json');
      if (!response.ok) return;
      
      const projects = await response.json();
      
      projects.forEach((project: any) => {
        const text = `${project.title}. ${project.subtitle}. ${project.description}. Technologies: ${project.technologies?.join(', ')}. Features: ${project.keyFeatures?.join('. ')}`;
        
        this.chunks.push({
          id: project.id,
          text,
          source: 'projects',
          metadata: { title: project.title, githubUrl: project.githubUrl }
        });
        
        this.embeddings.set(project.id, generateEmbedding(text));
      });
      
      this.loaded = true;
    } catch (e) {
      console.warn('Failed to load project RAG:', e);
    }
  }

  async search(query: string, topK: number = 2): Promise<SearchResult[]> {
    await this.load();
    if (this.chunks.length === 0) return [];
    
    const queryEmbedding = generateEmbedding(query);
    
    const scores = this.chunks.map(chunk => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, this.embeddings.get(chunk.id)!)
    }));
    
    return scores.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  async getContext(query: string): Promise<string> {
    const results = await this.search(query);
    if (results.length === 0) return '';
    
    return '\n\nAdditional project details:\n' + 
      results.map(r => `- ${r.chunk.metadata.title}: ${r.chunk.text.slice(0, 200)}...`).join('\n') +
      '\n';
  }

  get isLoaded() {
    return this.loaded;
  }
}

let instance: ProjectRAG | null = null;
export function getProjectRAG(): ProjectRAG {
  if (!instance) instance = new ProjectRAG();
  return instance;
}
