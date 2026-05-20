import { count, eq, and, gte } from 'drizzle-orm';
import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema/documents';

export const DOCUMENT_UPLOAD_LIMIT = 5;

export async function getDocumentUploadStatus(userId: string) {
  const since = new Date(Date.now() - 12 * 60 * 60 * 1000);

  const [result] = await db
    .select({ count: count() })
    .from(documents)
    .where(and(eq(documents.userId, userId), gte(documents.createdAt, since)));

  const used = result?.count ?? 0;

  return {
    used,
    limit: DOCUMENT_UPLOAD_LIMIT,
    remaining: Math.max(DOCUMENT_UPLOAD_LIMIT - used, 0),
    canUpload: used < DOCUMENT_UPLOAD_LIMIT,
  };
}