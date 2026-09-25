import { afterEach, describe, expect, it, vi } from 'vitest';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema/documents';
import { resources } from '@/lib/db/schema/resources';
import { embeddings } from '@/lib/db/schema/embeddings';
import { deleteDocument } from '@/features/documents/server/documents.service';

const currentUser = vi.hoisted(() => ({ userId: 'test-student-vitest' }));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(async () => ({ userId: currentUser.userId })),
}));

describe('deleteDocument', () => {
  afterEach(async () => {
    // Sigurnosna mreža u slučaju da neki test (npr. onaj koji očekuje grešku)
    // ne stigne do brisanja dokumenta.
    await db.delete(documents).where(eq(documents.userId, currentUser.userId));
  });

  it('briše dokument zajedno sa svim njegovim resursima i embedding-ima (ON DELETE CASCADE)', async () => {
    // Ovde se dokument, resurs i embedding upisuju direktno u bazu, bez
    // pokretanja stvarnog PDF/AI pipeline-a (unpdf ekstrakcija teksta i
    // pozivi ka embedding modelu), jer se testira isključivo operacija
    // brisanja i njeno kaskadno dejstvo nad zavisnim tabelama.
    const [document] = await db
      .insert(documents)
      .values({
        userId: currentUser.userId,
        fileName: 'test-gradivo.pdf',
        fileSize: 1024,
        pageCount: 1,
        fileUrl: 'https://example.com/test-gradivo.pdf',
      })
      .returning();

    const [resource] = await db
      .insert(resources)
      .values({
        userId: currentUser.userId,
        documentId: document.id,
        content: 'Testni isečak sadržaja dokumenta.',
        pageNumber: 1,
        chunkIndex: 0,
      })
      .returning();

    await db.insert(embeddings).values({
      resourceId: resource.id,
      content: resource.content,
      embedding: new Array(1024).fill(0),
    });

    await deleteDocument(document.id);

    const remainingDocuments = await db
      .select()
      .from(documents)
      .where(eq(documents.id, document.id));
    const remainingResources = await db
      .select()
      .from(resources)
      .where(eq(resources.documentId, document.id));
    const remainingEmbeddings = await db
      .select()
      .from(embeddings)
      .where(eq(embeddings.resourceId, resource.id));

    expect(remainingDocuments).toHaveLength(0);
    expect(remainingResources).toHaveLength(0);
    expect(remainingEmbeddings).toHaveLength(0);
  });

  it('odbija brisanje dokumenta koji ne postoji', async () => {
    await expect(deleteDocument('nonexistent-document-id')).rejects.toThrow(
      'Document not found',
    );
  });
});
