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

export type SubmitButtonProps = {
  disabled: boolean;
  darkMode: boolean;
  isLoading?: boolean;
};

