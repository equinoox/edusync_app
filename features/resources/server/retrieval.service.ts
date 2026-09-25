import { generateEmbedding } from '@/lib/ai/embedding-provider';
import { auth } from '@clerk/nextjs/server';
import {
  findDocumentEmbeddingChunks,
  findSimilarEmbeddings,
} from '@/features/resources/repositories/embeddings.repository';
import {
  getUserDocumentById,
  getUserDocuments,
} from '@/features/documents/repositories/documents.repository';
import type { UserDocument } from '@/features/resources/types';
import type { ChunkContentType } from '@/lib/ai/chunking';

const normalizeDocumentName = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');

// Reference to a document without naming it ("the file I just uploaded",
// "dokument koji sam malopre poslao"). Matched loosely because Serbian is
// inflected and the student rarely repeats the exact file name.
const DOCUMENT_NOUN_PATTERN =
  /(document|file|pdf|attachment|material|dokument|fajl|materijal|gradivo|skript|prezentacij|belesk|bele[sš]k)/i;

const RECENCY_PATTERN =
  /(last|latest|newest|most recent|just now|earlier|malo\s?pre|malo\s?prije|malo\s?cas|malo\s?čas|nedavno|upravo|maloprije|skoro|poslednj|posljednj|zadnj|najnovij|prethodn)/i;

const UPLOAD_VERB_PATTERN =
  /(upload|uplod|attach|sent|added|poslao|poslala|posla sam|dodao|dodala|ubacio|ubacila|okacio|okačio|okacila|okačila|kacio|kačio)/i;

const mentionsMostRecentDocument = (value: string) =>
  DOCUMENT_NOUN_PATTERN.test(value) &&
  (RECENCY_PATTERN.test(value) || UPLOAD_VERB_PATTERN.test(value));

const getPreferredContentTypes = (value: string): ChunkContentType[] => {
  const normalized = value.toLowerCase();
  const preferred: ChunkContentType[] = [];

  if (/\b(table|tables|row|rows|column|columns)\b/.test(normalized)) {
    preferred.push('table');
  }

  if (/\b(code|function|class|method|import|export|variable|script)\b/.test(normalized)) {
    preferred.push('code');
  }

  if (/\b(formula|equation|math|calculate|calculation)\b/.test(normalized)) {
    preferred.push('formula');
  }

  return preferred;
};

const matchDocumentByName = (
  documents: UserDocument[],
  fileName: string | undefined,
  userQuery: string,
) => {
  const requestedName = normalizeDocumentName(fileName ?? '');
  const queryText = normalizeDocumentName(userQuery);
  const candidates = documents.map(document => ({
    document,
    normalizedFileName: normalizeDocumentName(document.fileName),
  }));

  const exactMatch = candidates.find(
    ({ normalizedFileName }) =>
      normalizedFileName.length > 0 &&
      (normalizedFileName === requestedName || normalizedFileName === queryText),
  );

  if (exactMatch) return exactMatch.document;

  // The full file name appears somewhere inside what the student wrote.
  const mentioned = candidates
    .filter(({ normalizedFileName }) => {
      const paddedFileName = ` ${normalizedFileName} `;

      return (
        ` ${queryText} `.includes(paddedFileName) ||
        (requestedName.length > 0 && ` ${requestedName} `.includes(paddedFileName))
      );
    })
    .sort((left, right) => right.normalizedFileName.length - left.normalizedFileName.length);

  if (mentioned[0]) return mentioned[0].document;

  // The model passed a partial name ("fizika" for "Fizika-2-kinematika.pdf").
  // Only trusted for reasonably specific fragments, to avoid random matches.
  if (requestedName.length >= 4) {
    const partial = candidates
      .filter(({ normalizedFileName }) => normalizedFileName.includes(requestedName))
      .sort((left, right) => left.normalizedFileName.length - right.normalizedFileName.length);

    if (partial[0]) return partial[0].document;
  }

  return undefined;
};

const resolveMentionedDocument = async (
  userId: string,
  userQuery: string,
  fileName?: string,
  documentId?: string,
) => {
  if (documentId) {
    return getUserDocumentById(documentId, userId);
  }

  // Ordered newest first, so documents[0] is also the "most recent" answer.
  const documents = await getUserDocuments(userId);
  const namedDocument = matchDocumentByName(documents, fileName, userQuery);

  // An explicitly named file always wins over a vague recency reference, since
  // "the PDF I uploaded about kinematics" contains both signals.
  if (namedDocument) return namedDocument;

  if (mentionsMostRecentDocument(userQuery) || mentionsMostRecentDocument(fileName ?? '')) {
    return documents[0];
  }

  return undefined;
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
  documentId?: string,
) => {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const document = await resolveMentionedDocument(userId, userQuery, fileName, documentId);
  const requestedFileName = fileName?.trim();

  if (documentId && !document) {
    return {
      document: null,
      results: [],
      message: 'The selected document is no longer available.',
    };
  }

  if (requestedFileName && !document) {
    // Hand the tutor the real file names so it can ask the student to pick one
    // instead of guessing or claiming the material does not exist.
    const availableDocuments = await getUserDocuments(userId);

    return {
      document: null,
      results: [],
      message: `No uploaded document named "${requestedFileName}" was found for this user.`,
      availableDocuments: availableDocuments.map(({ fileName: name }) => name),
    };
  }

  const userQueryEmbedding = await generateEmbedding(userQuery);

  let results = await findSimilarEmbeddings(
    userQueryEmbedding,
    userId,
    document?.id,
    getPreferredContentTypes(userQuery),
  );

  if (document && results.length === 0) {
    results = await findDocumentEmbeddingChunks(userId, document.id);
  }

  return {
    document: toDocumentReference(document),
    results,
  };
};
