export type {
  NewResourceParams,
} from '@/lib/db/schema/resources';

import type { getUserDocuments } from '@/features/documents/repositories/documents.repository';
import type { ChunkContentType } from '@/lib/ai/chunking';

export type UserDocument = Awaited<ReturnType<typeof getUserDocuments>>[number];

export type ResourceChunkMetadata = {
  pageNumber?: number | null;
  chunkIndex?: number | null;
  contentType?: ChunkContentType | null;
};

export type EmbeddingInsert = {
  resourceId: string;
  content: string;
  embedding: number[];
};
