import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  type UIMessage,
} from 'ai';

import { CHAT_MODEL, MAX_CHAT_STEPS } from '@/lib/ai/ai-config';
import { CHAT_SYSTEM_PROMPT } from '@/features/chat/server/chat.config';
import { createChatTools } from '@/features/chat/server/chat.tools';

type SelectedDocumentContext = {
  id: string;
  fileName: string;
};

const formatDocumentNameForPrompt = (fileName: string) =>
  JSON.stringify(fileName.replace(/\s+/g, ' ').trim());

export const createChatResponse = async (
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

  return streamText({
    model: CHAT_MODEL,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(MAX_CHAT_STEPS),
    system: `${CHAT_SYSTEM_PROMPT}${selectedDocumentPrompt}`,
    tools: createChatTools(selectedDocument),
    onFinish: async ({ text }) => {
      if (text.trim()) {
        await onFinish?.(text);
      }
    },
  });
};
