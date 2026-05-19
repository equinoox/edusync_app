import { generateEmbeddings } from '@/lib/ai/embedding-provider';
import { auth } from '@clerk/nextjs/server';

import { insertResourceSchema } from '@/features/resources/schemas';
import type { NewResourceParams } from '@/features/resources/types';
import { createResourceRecord } from '@/features/resources/repositories/resources.repository';
import { createEmbeddingRecords } from '@/features/resources/repositories/embeddings.repository';

export const createResource = async (input: NewResourceParams) => {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { content } = insertResourceSchema.parse(input);

  const resource = await createResourceRecord(content, userId);
  const embeddings = await generateEmbeddings(content);

  await createEmbeddingRecords(
    embeddings.map(embedding => ({
      resourceId: resource.id,
      ...embedding,
    })),
  );

  return 'Resource successfully created and embedded.';
};