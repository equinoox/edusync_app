import { tool } from 'ai';
import { z } from 'zod';

import { createResourceAction } from '@/features/resources/actions/resources.actions';
import { findRelevantContent } from '@/features/resources/server/retrieval.service';

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
Get information from the user's knowledge base to answer questions.
If the user names a PDF file or says "last/latest document", pass that file reference in fileName so retrieval searches only that uploaded file.
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
});
