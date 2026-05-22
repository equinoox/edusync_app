import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema/documents';

export async function createDocumentRecord(input: typeof documents.$inferInsert) {
  const [document] = await db.insert(documents).values(input).returning();
  return document;
}

export async function getUserDocuments(userId: string) {
  return db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt));
}

export async function getMostRecentUserDocument(userId: string) {
  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt))
    .limit(1);

  return document;
}

export async function getUserDocumentById(documentId: string, userId: string) {
  const [document] = await db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.id, documentId),
        eq(documents.userId, userId),
      ),
    )
    .limit(1);

  return document;
}

export async function deleteUserDocument(documentId: string, userId: string) {
  const [document] = await db
    .delete(documents)
    .where(
      and(
        eq(documents.id, documentId),
        eq(documents.userId, userId),
      ),
    )
    .returning();

  return document;
}
