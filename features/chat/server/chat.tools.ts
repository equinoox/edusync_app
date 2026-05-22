import { tool } from 'ai';
import { z } from 'zod';

import { createResourceAction } from '@/features/resources/actions/resources.actions';
import { findRelevantContent } from '@/features/resources/server/retrieval.service';

export const chatTools = {
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
This tool searches stored chunks and embeddings; the assistant does not need direct PDF file access when this returns results.
`,
    inputSchema: z.object({
      question: z.string().describe('the user question'),
      fileName: z
        .string()
        .optional()
        .describe('optional PDF filename mentioned by the user, for file-specific retrieval'),
    }),
    execute: async ({ question, fileName }) => findRelevantContent(question, fileName),
  }),
};
