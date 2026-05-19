import { generateEmbedding } from '@/lib/ai/embedding-provider';
import { auth } from '@clerk/nextjs/server';
import { findSimilarEmbeddings } from '@/features/resources/repositories/embeddings.repository';

export const findRelevantContent = async (userQuery: string) => {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const userQueryEmbedding = await generateEmbedding(userQuery);

  return findSimilarEmbeddings(userQueryEmbedding, userId);
};