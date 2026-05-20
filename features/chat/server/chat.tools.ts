import { tool } from 'ai';
import { z } from 'zod';

import { createResource } from '@/features/resources/server/resources.service';
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
    execute: async ({ content }) => createResource({ content }),
  }),

  getInformation: tool({
    description: 'Get information from your knowledge base to answer questions.',
    inputSchema: z.object({
      question: z.string().describe('the user question'),
    }),
    execute: async ({ question }) => findRelevantContent(question),
  }),
};