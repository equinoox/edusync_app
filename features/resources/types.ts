export type {
  NewResourceParams,
} from '@/lib/db/schema/resources';

import type { getUserDocuments } from '@/features/documents/repositories/documents.repository';

export type UserDocument = Awaited<ReturnType<typeof getUserDocuments>>[number];

export type EmbeddingInsert = {
  resourceId: string;
  content: string;
  embedding: number[];
};
