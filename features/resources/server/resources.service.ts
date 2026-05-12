import { generateEmbeddings } from '@/lib/ai/embedding-provider';

import { insertResourceSchema } from '@/features/resources/schemas';
import type { NewResourceParams } from '@/features/resources/types';
import { createResourceRecord } from '@/features/resources/repositories/resources.repository';
import { createEmbeddingRecords } from '@/features/resources/repositories/embeddings.repository';

export const createResource = async (input: NewResourceParams) => {
  const { content } = insertResourceSchema.parse(input);

  const resource = await createResourceRecord(content);
  const embeddings = await generateEmbeddings(content);

  await createEmbeddingRecords(
    embeddings.map(embedding => ({
      resourceId: resource.id,
      ...embedding,
    })),
  );

  return 'Resource successfully created and embedded.';
};