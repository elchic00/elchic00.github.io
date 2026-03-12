import { useState, useEffect, useCallback } from 'react';
import { getProjectRAG } from './rag';

export function useProjectRAG() {
  const [isReady, setIsReady] = useState(false);
  const rag = getProjectRAG();

  useEffect(() => {
    rag.load().then(() => setIsReady(true));
  }, []);

  const getContext = useCallback(async (query: string) => {
    return rag.getContext(query);
  }, []);

  return { isReady, getContext };
}
