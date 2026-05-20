import { auth } from '@clerk/nextjs/server';
import { generateEmbeddings } from '@/lib/ai/embedding-provider';
import { createResourceRecord } from '@/features/resources/repositories/resources.repository';
import { createEmbeddingRecords } from '@/features/resources/repositories/embeddings.repository';
import { createDocumentRecord } from '@/features/documents/repositories/documents.repository';
import { getDocumentUploadStatus } from './document-upload-limit.service';
import { extractPdfText } from './pdf-text.service';

export async function uploadDocument(file: File, options: { fileUrl: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  if (file.type !== 'application/pdf') throw new Error('Only PDF files are supported');
  if (file.size > 8 * 1024 * 1024) throw new Error('PDF must be smaller than 8MB');

  const status = await getDocumentUploadStatus(userId);
  if (!status.canUpload) throw new Error('You can upload 5 documents every 12 hours');

  const { text, pageCount } = await extractPdfText(file);
  if (!text) throw new Error('No readable text found in this PDF');

  const resource = await createResourceRecord(text, userId);
  const embeddings = await generateEmbeddings(text);

  await createEmbeddingRecords(
    embeddings.map(embedding => ({
      resourceId: resource.id,
      ...embedding,
    })),
  );

  await createDocumentRecord({
    userId,
    resourceId: resource.id,
    fileName: file.name,
    fileSize: file.size,
    fileUrl: options.fileUrl,
    pageCount,
  });

  return { fileName: file.name, pageCount };
}