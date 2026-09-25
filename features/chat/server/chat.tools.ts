import { tool } from 'ai';
import { z } from 'zod';

import { createResourceAction } from '@/features/resources/actions/resources.actions';
import { findRelevantContent } from '@/features/resources/server/retrieval.service';
import { searchWeb } from '@/features/chat/server/web-search.service';

type SelectedDocumentContext = {
  id: string;
  fileName: string;
};

const formatDocumentNameForPrompt = (fileName: string) =>
  JSON.stringify(fileName.replace(/\s+/g, ' ').trim());

export const createChatTools = (selectedDocument?: SelectedDocumentContext) => ({
  addResource: tool({
    description: `
Add a resource to your knowledge base.
If the user provides a random piece of knowledge unprompted,
use this tool without asking for confirmation.
`,
    inputSchema: z.object({
      content: z
        .string()
        .describe('the content or resource to add to the knowledge base'),
    }),
    execute: async ({ content }) => createResourceAction({ content }),
  }),

  getInformation: tool({
    description: `
Search the student's uploaded study materials. This is your primary tool — call it before answering any question about course content, even when the student's reference is vague.
Pass fileName whenever the student names a file, or when the "Uploaded Materials" list in your system prompt makes it clear which file they mean (for example after "the document I just uploaded").
The result includes the resolved document, so you can tell the student exactly which file you are reading from. If it returns availableDocuments, the requested file does not exist — ask the student to pick one of those names.
${selectedDocument ? `The user selected ${formatDocumentNameForPrompt(selectedDocument.fileName)} in the chat document picker. For vague references like "this", "this material", or "the selected document", call this tool; retrieval is already scoped to that selected document.` : ''}
This tool searches stored chunks and embeddings; the assistant does not need direct PDF file access when this returns results.
`,
    inputSchema: z.object({
      question: z.string().describe('the user question'),
      fileName: z
        .string()
        .optional()
        .describe('optional PDF filename mentioned by the user, for file-specific retrieval'),
    }),
    execute: async ({ question, fileName }) =>
      findRelevantContent(question, fileName, selectedDocument?.id),
  }),

  searchWeb: tool({
    description: `
Look up current information on the public internet.
Call this ONLY when the student explicitly asks you to search online, check the internet, or find sources beyond their uploaded materials.
Never call it to fill gaps on your own — if the uploaded materials do not cover something, say so and offer to search instead.
`,
    inputSchema: z.object({
      query: z
        .string()
        .describe('a focused search query derived from what the student asked'),
    }),
    execute: async ({ query }) => searchWeb(query),
  }),
});
