import { generateEmbedding } from '@/lib/ai/embedding-provider';
import { findSimilarEmbeddings } from '@/features/resources/repositories/embeddings.repository';

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedding = await generateEmbedding(userQuery);

  return findSimilarEmbeddings(userQueryEmbedding);
};