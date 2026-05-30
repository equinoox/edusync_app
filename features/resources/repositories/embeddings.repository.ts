import { and, asc, cosineDistance, desc, eq, gt, inArray, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { SIMILARITY_THRESHOLD, MAX_RELEVANT_RESULTS } from '@/lib/ai/ai-config';
import { embeddings } from '@/lib/db/schema/embeddings';
import { resources } from '@/lib/db/schema/resources';
import type { ChunkContentType } from '@/lib/ai/chunking';
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
  preferredContentTypes: ChunkContentType[] = [],
) => {
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    queryEmbedding,
  )})`;
  const adjustedSimilarity = preferredContentTypes.length > 0
    ? sql<number>`${similarity} + case when ${inArray(resources.contentType, preferredContentTypes)} then 0.04 else 0 end`
    : similarity;
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
      pageNumber: resources.pageNumber,
      chunkIndex: resources.chunkIndex,
      contentType: resources.contentType,
      similarity: adjustedSimilarity,
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
      pageNumber: resources.pageNumber,
      chunkIndex: resources.chunkIndex,
      contentType: resources.contentType,
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
    .orderBy(asc(resources.chunkIndex))
    .limit(MAX_RELEVANT_RESULTS);
};
