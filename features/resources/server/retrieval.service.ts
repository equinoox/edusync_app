import { generateEmbedding } from '@/lib/ai/embedding-provider';
import { auth } from '@clerk/nextjs/server';
import {
  findDocumentEmbeddingChunks,
  findSimilarEmbeddings,
} from '@/features/resources/repositories/embeddings.repository';
import {
  getMostRecentUserDocument,
  getUserDocuments,
} from '@/features/documents/repositories/documents.repository';

type UserDocument = Awaited<ReturnType<typeof getUserDocuments>>[number];

const normalizeDocumentName = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const mentionsMostRecentDocument = (value: string) =>
  /\b(last|latest|newest|most recent)\s+(document|file|pdf)\b/i.test(value) ||
  /\b(document|file|pdf)\s+(i\s+)?(last|latest|newest|most recently)\s+(sent|uploaded|added)\b/i.test(value);

const resolveMentionedDocument = async (
  userId: string,
  userQuery: string,
  fileName?: string,
) => {
  if (mentionsMostRecentDocument(userQuery) || mentionsMostRecentDocument(fileName ?? '')) {
    return getMostRecentUserDocument(userId);
  }

  const documents = await getUserDocuments(userId);
  const requestedName = normalizeDocumentName(fileName ?? userQuery);

  if (!requestedName) return undefined;

  const exactMatch = documents.find(document => {
    const normalizedFileName = normalizeDocumentName(document.fileName);
    return normalizedFileName === requestedName;
  });

  if (exactMatch) return exactMatch;

  const mentionedDocuments = documents
    .map(document => ({
      document,
      normalizedFileName: normalizeDocumentName(document.fileName),
    }))
    .filter(({ normalizedFileName }) => {
      const paddedQuery = ` ${requestedName} `;
      const paddedFileName = ` ${normalizedFileName} `;

      return paddedQuery.includes(paddedFileName);
    })
    .sort((left, right) => right.normalizedFileName.length - left.normalizedFileName.length);

  return mentionedDocuments[0]?.document;
};

const toDocumentReference = (document: UserDocument | undefined) => {
  if (!document) return null;

  return {
    id: document.id,
    fileName: document.fileName,
    createdAt: document.createdAt,
  };
};

export const findRelevantContent = async (
  userQuery: string,
  fileName?: string,
) => {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const document = await resolveMentionedDocument(userId, userQuery, fileName);
  const requestedFileName = fileName?.trim();

  if (requestedFileName && !document) {
    return {
      document: null,
      results: [],
      message: `No uploaded document named "${requestedFileName}" was found for this user.`,
    };
  }

  const userQueryEmbedding = await generateEmbedding(userQuery);

  let results = await findSimilarEmbeddings(
    userQueryEmbedding,
    userId,
    document?.id,
  );

  if (document && results.length === 0) {
    results = await findDocumentEmbeddingChunks(userId, document.id);
  }

  return {
    document: toDocumentReference(document),
    results,
  };
};
