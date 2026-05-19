import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema/resources';

export const createResourceRecord = async (content: string, userId: string) => {
  const [resource] = await db
    .insert(resources)
    .values({ content, userId })
    .returning();

  return resource;
};