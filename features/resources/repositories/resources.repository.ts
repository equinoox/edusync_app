import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema/resources';
import type { ResourceChunkMetadata } from '@/features/resources/types';

export const createResourceRecord = async (
  content: string,
  userId: string,
  documentId?: string,
  metadata: ResourceChunkMetadata = {},
) => {
  const [resource] = await db
    .insert(resources)
    .values({
      content,
      userId,
      documentId,
      pageNumber: metadata.pageNumber,
      chunkIndex: metadata.chunkIndex,
      contentType: metadata.contentType ?? 'text',
    })
    .returning();

  return resource;
};
