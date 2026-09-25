export const CHAT_MODEL = "inclusionai/ling-3.0-flash-fin";

export const EMBEDDING_MODEL = "alibaba/qwen3-embedding-0.6b";

// Used only by the `searchWeb` tool, which the tutor may call when the student
// explicitly asks for information from the internet. Routed through the same
// AI Gateway key as CHAT_MODEL, so no extra provider credentials are needed.
export const WEB_SEARCH_MODEL = "perplexity/sonar";

export const MAX_CHAT_STEPS = 10; // Increased for more detailed explanations

export const SIMILARITY_THRESHOLD = 0.4; // Lowered to get more contextual results for learning

export const MAX_RELEVANT_RESULTS = 6; // Increased to provide more comprehensive context
