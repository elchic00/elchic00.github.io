
export interface RAGDocument {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  technologies?: string[];
  keyFeatures?: string[];
  githubUrl?: string;
  backendUrl?: string;
  liveUrl?: string;
  image?: string;
  videos?: string[];
  category?: string;
  impact?: string;
  source?: string;
}

export interface RAGChunk {
  id: string;
  text: string;
  source: 'resume' | 'experience' | 'projects' | string;
  metadata: {
    title?: string;
    section?: string;
    githubUrl?: string;
    category?: string;
    technologies?: string[];
  };
}

export interface SearchResult {
  chunk: RAGChunk;
  score: number;
}

export interface RAGContext {
  context: string;
  sources: string[];
}
