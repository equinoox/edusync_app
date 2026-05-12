import { cosineDistance, desc, gt, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { SIMILARITY_THRESHOLD, MAX_RELEVANT_RESULTS } from '@/lib/ai/ai-config';
import { embeddings } from '@/lib/db/schema/embeddings';

type EmbeddingInsert = {
  resourceId: string;
  content: string;
  embedding: number[];
};

export const createEmbeddingRecords = async (
  values: EmbeddingInsert[],
) => {
  await db.insert(embeddings).values(values);
};

export const findSimilarEmbeddings = async (queryEmbedding: number[]) => {
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    queryEmbedding,
  )})`;

  return db
    .select({
      name: embeddings.content,
      similarity,
    })
    .from(embeddings)
    .where(gt(similarity, SIMILARITY_THRESHOLD))
    .orderBy(table => desc(table.similarity))
    .limit(MAX_RELEVANT_RESULTS);
};