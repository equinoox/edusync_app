import { and, cosineDistance, desc, eq, gt, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { SIMILARITY_THRESHOLD, MAX_RELEVANT_RESULTS } from '@/lib/ai/ai-config';
import { embeddings } from '@/lib/db/schema/embeddings';
import { resources } from '@/lib/db/schema/resources';
import type { EmbeddingInsert } from '@/features/resources/types';

export const createEmbeddingRecords = async (
  values: EmbeddingInsert[],
) => {
  await db.insert(embeddings).values(values);
};

export const findSimilarEmbeddings = async (
  queryEmbedding: number[],
  userId: string,
  documentId?: string,
) => {
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    queryEmbedding,
  )})`;
  const filters = [
    gt(similarity, SIMILARITY_THRESHOLD),
    eq(resources.userId, userId),
  ];

  if (documentId) {
    filters.push(eq(resources.documentId, documentId));
  }

  return db
    .select({
      content: embeddings.content,
      resourceId: resources.id,
      documentId: resources.documentId,
      similarity,
    })
    .from(embeddings)
    .innerJoin(resources, eq(embeddings.resourceId, resources.id))
    .where(and(...filters))
    .orderBy(table => desc(table.similarity))
    .limit(MAX_RELEVANT_RESULTS);
};

export const findDocumentEmbeddingChunks = async (
  userId: string,
  documentId: string,
) => {
  return db
    .select({
      content: embeddings.content,
      resourceId: resources.id,
      documentId: resources.documentId,
      similarity: sql<number>`1`,
    })
    .from(embeddings)
    .innerJoin(resources, eq(embeddings.resourceId, resources.id))
    .where(
      and(
        eq(resources.userId, userId),
        eq(resources.documentId, documentId),
      ),
    )
    .limit(MAX_RELEVANT_RESULTS);
};
