import { auth } from '@clerk/nextjs/server';
import { generateEmbeddingsForChunks } from '@/lib/ai/embedding-provider';
import { generateChunks } from '@/lib/ai/chunking';
import { createResourceRecord } from '@/features/resources/repositories/resources.repository';
import { createEmbeddingRecords } from '@/features/resources/repositories/embeddings.repository';
import {
  createDocumentRecord,
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

  const { text, pageCount } = await extractPdfText(file);
  if (!text) throw new Error('No readable text found in this PDF');

  const chunks = generateChunks(text);
  if (chunks.length === 0) {
    throw new Error('No readable text found in this PDF');
  }

  const document = await createDocumentRecord({
    userId,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: options.fileUrl,
    storageKey: options.storageKey,
    pageCount,
  });

  const resources = [];
  for (const chunk of chunks) {
    resources.push(await createResourceRecord(chunk, userId, document.id));
  }

  const embeddings = await generateEmbeddingsForChunks(chunks);
  const embeddingRecords = [];

  for (const [index, embedding] of embeddings.entries()) {
    embeddingRecords.push({
      resourceId: resources[index].id,
      ...embedding,
    });
  }

  await createEmbeddingRecords(embeddingRecords);

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
