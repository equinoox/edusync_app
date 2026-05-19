import { cosineDistance, desc, gt, sql, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { SIMILARITY_THRESHOLD, MAX_RELEVANT_RESULTS } from '@/lib/ai/ai-config';
import { embeddings } from '@/lib/db/schema/embeddings';
import { resources } from '@/lib/db/schema/resources';

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

export const findSimilarEmbeddings = async (queryEmbedding: number[], userId: string) => {
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
    .innerJoin(resources, eq(embeddings.resourceId, resources.id))
    .where(
      sql`${gt(similarity, SIMILARITY_THRESHOLD)} AND ${eq(resources.userId, userId)}`
    )
    .orderBy(table => desc(table.similarity))
    .limit(MAX_RELEVANT_RESULTS);
};