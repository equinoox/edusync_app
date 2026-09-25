import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  type UIMessage,
} from 'ai';

import { CHAT_MODEL, MAX_CHAT_STEPS } from '@/lib/ai/ai-config';
import { CHAT_SYSTEM_PROMPT } from '@/features/chat/server/chat.config';
import { createChatTools } from '@/features/chat/server/chat.tools';
import { getUserDocuments } from '@/features/documents/repositories/documents.repository';

type SelectedDocumentContext = {
  id: string;
  fileName: string;
};

// Enough for the tutor to recognise what the student is referring to without
// crowding the prompt for users with a large library.
const MAX_LISTED_DOCUMENTS = 20;

const formatDocumentNameForPrompt = (fileName: string) =>
  JSON.stringify(fileName.replace(/\s+/g, ' ').trim());

const formatUploadAge = (createdAt: Date) => {
  const minutes = Math.round((Date.now() - createdAt.getTime()) / 60_000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;

  const days = Math.round(hours / 24);
  return `${days} d ago`;
};

/**
 * Lists the student's uploads directly in the system prompt so the tutor knows
 * what exists before calling any tool. Without this it cannot resolve vague
 * references like "the document I uploaded a moment ago".
 */
const buildDocumentInventoryPrompt = async (userId: string) => {
  const documents = await getUserDocuments(userId);

  if (documents.length === 0) {
    return '\n\n## Uploaded Materials\nThis student has not uploaded any documents yet. If they refer to one, tell them nothing is uploaded and ask them to upload it first.';
  }

  const listed = documents
    .slice(0, MAX_LISTED_DOCUMENTS)
    .map(
      (document, index) =>
        `${index + 1}. ${document.fileName} — ${document.pageCount} pages, uploaded ${formatUploadAge(document.createdAt)}`,
    )
    .join('\n');
  const overflow =
    documents.length > MAX_LISTED_DOCUMENTS
      ? `\n(+${documents.length - MAX_LISTED_DOCUMENTS} older documents not listed)`
      : '';

  return `\n\n## Uploaded Materials\nNewest first. Entry 1 is what "the document I just uploaded" refers to.\n${listed}${overflow}`;
};

export const createChatResponse = async (
  userId: string,
  messages: UIMessage[],
  selectedDocument?: SelectedDocumentContext,
  onFinish?: (text: string) => Promise<void> | void,
) => {
  const selectedDocumentName = selectedDocument
    ? formatDocumentNameForPrompt(selectedDocument.fileName)
    : '';
  const selectedDocumentPrompt = selectedDocument
    ? `\n\n## Selected Document\nThe user selected ${selectedDocumentName} in the chat document picker. For requests like "help me learn this", "explain this", "summarize this", or questions about the selected material, call \`getInformation\` first and answer only from that selected document's retrieved chunks.`
    : '';
  const documentInventoryPrompt = await buildDocumentInventoryPrompt(userId);

  return streamText({
    model: CHAT_MODEL,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(MAX_CHAT_STEPS),
    system: `${CHAT_SYSTEM_PROMPT}${documentInventoryPrompt}${selectedDocumentPrompt}`,
    tools: createChatTools(selectedDocument),
    onFinish: async ({ text }) => {
      if (text.trim()) {
        await onFinish?.(text);
      }
    },
  });
};
