import { embed, embedMany } from 'ai';

import { EMBEDDING_MODEL } from '@/lib/ai/ai-config';
import { generateChunks } from '@/lib/ai/chunking';

export type GeneratedEmbedding = {
  content: string;
  embedding: number[];
};

export const generateEmbeddings = async (
  value: string,
): Promise<GeneratedEmbedding[]> => {
  const chunks = generateChunks(value);

  const { embeddings } = await embedMany({
    model: EMBEDDING_MODEL,
    values: chunks,
  });

  return embeddings.map((embedding, index) => ({
    content: chunks[index],
    embedding,
  }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\n', ' ');

  const { embedding } = await embed({
    model: EMBEDDING_MODEL,
    value: input,
  });

  return embedding;
};