import { auth } from '@clerk/nextjs/server';
import { generateEmbeddingsForChunks } from '@/lib/ai/embedding-provider';
import { createSemanticChunks } from '@/lib/ai/chunking';
import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema/documents';
import { embeddings as embeddingsTable } from '@/lib/db/schema/embeddings';
import { resources as resourcesTable } from '@/lib/db/schema/resources';
import {
  deleteUserDocument,
} from '@/features/documents/repositories/documents.repository';
import { getDocumentUploadStatus } from './document-upload-limit.service';
import { extractPdfText } from './pdf-text.service';

export async function uploadDocument(
  file: File,
  options: { fileUrl: string; storageKey?: string },
) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  return ingestDocumentForUser(file, userId, options);
}

export async function ingestDocumentForUser(
  file: File,
  userId: string,
  options: { fileUrl: string; storageKey?: string },
) {

  if (file.type !== 'application/pdf') throw new Error('Only PDF files are supported');
  if (file.size > 8 * 1024 * 1024) throw new Error('PDF must be smaller than 8MB');

  const status = await getDocumentUploadStatus(userId);
  if (!status.canUpload) throw new Error('You can upload 5 documents every 12 hours');

  const { text, pages, pageCount } = await extractPdfText(file);
  if (!text) throw new Error('No readable text found in this PDF');

  const chunks = createSemanticChunks(pages);
  if (chunks.length === 0) {
    throw new Error('No readable text found in this PDF');
  }

  const chunkContents = chunks.map(chunk => chunk.content);
  const embeddings = await generateEmbeddingsForChunks(chunkContents);

  const document = await db.transaction(async tx => {
    const [createdDocument] = await tx
      .insert(documents)
      .values({
        userId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: options.fileUrl,
        storageKey: options.storageKey,
        pageCount,
      })
      .returning();

    const createdResources = await tx
      .insert(resourcesTable)
      .values(
        chunks.map(chunk => ({
          content: chunk.content,
          userId,
          documentId: createdDocument.id,
          pageNumber: chunk.pageNumber,
          chunkIndex: chunk.chunkIndex,
          contentType: chunk.contentType,
        })),
      )
      .returning();

    await tx.insert(embeddingsTable).values(
      embeddings.map((embedding, index) => ({
        resourceId: createdResources[index].id,
        ...embedding,
      })),
    );

    return createdDocument;
  });

  return document;
}

export async function copyDocumentFromUrlForUser(input: {
  userId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  storageKey?: string | null;
}) {
  const response = await fetch(input.fileUrl);

  if (!response.ok) {
    throw new Error('Unable to copy lesson material');
  }

  const blob = await response.blob();
  const file = new File([blob], input.fileName, {
    type: input.mimeType,
  });

  return ingestDocumentForUser(file, input.userId, {
    fileUrl: input.fileUrl,
    storageKey: input.storageKey ?? undefined,
  });
}

export async function deleteDocument(documentId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const deletedDocument = await deleteUserDocument(documentId, userId);

  if (!deletedDocument) {
    throw new Error('Document not found');
  }

  return deletedDocument;
}
