import type { UIMessage } from 'ai';

export type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  messages?: UIMessage[];
};

export type ChatMessagesProps = {
  messages: UIMessage[];
};

export type ToolCallViewProps = {
  part: {
    type?: string;
    toolName?: string;
    state?: string;
    input?: unknown;
    output?: unknown;
  };
};

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  preview?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatSessionWithMessages extends ChatSession {
  messages: ChatMessage[];
}
