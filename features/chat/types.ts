import type { UIMessage } from 'ai';
import type { DocumentListItem, DocumentUploadResult } from '@/features/documents/types';

export type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  messages?: UIMessage[];
  documents?: DocumentListItem[];
  selectedDocumentId?: string;
  onSelectedDocumentChange?: (documentId: string) => void;
  onDocumentUploaded?: (documents: DocumentUploadResult[]) => void;
  onDocumentUploadError?: () => void;
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

