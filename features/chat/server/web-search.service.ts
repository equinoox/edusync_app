import { generateText } from 'ai';

import { WEB_SEARCH_MODEL } from '@/lib/ai/ai-config';

/**
 * `Source` is not exported from `ai` v6, and only url-type sources carry a
 * link, so the shape is narrowed structurally instead.
 */
const toLinkedSources = (sources: readonly unknown[]) =>
  sources.flatMap(source => {
    if (!source || typeof source !== 'object') return [];

    const { sourceType, url, title } = source as {
      sourceType?: string;
      url?: string;
      title?: string;
    };

    if (sourceType !== 'url' || !url) return [];

    return [{ title: title ?? url, url }];
  });

const WEB_SEARCH_SYSTEM_PROMPT = `
You are a research assistant for a student. Answer the query using current
information from the web. Be factual and concise (at most 6 sentences), and
state plainly when sources disagree or when something could not be verified.
`;

type WebSearchResult = {
  query: string;
  summary: string | null;
  sources: { title: string; url: string }[];
  error?: string;
};

/**
 * Only called through the `searchWeb` tool, which the tutor is instructed to
 * use exclusively when the student explicitly asks to look something up online.
 */
export const searchWeb = async (query: string): Promise<WebSearchResult> => {
  try {
    const { text, sources } = await generateText({
      model: WEB_SEARCH_MODEL,
      system: WEB_SEARCH_SYSTEM_PROMPT,
      prompt: query,
    });

    return {
      query,
      summary: text.trim() || null,
      sources: toLinkedSources(sources ?? []),
    };
  } catch (error) {
    console.error('Web search failed:', error);

    return {
      query,
      summary: null,
      sources: [],
      error:
        'Web search is currently unavailable. Answer from the uploaded materials instead, and tell the student the web lookup failed.',
    };
  }
};
