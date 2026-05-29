'use client';

import { useRef, useState } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/ui/button';
import { ACCEPTED_DOCUMENT_TYPE } from '@/features/documents/schemas';
import type {
  DocumentUploadButtonProps,
  DocumentUploadResult,
} from '@/features/documents/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';

export function DocumentUploadButton({
  className,
  disabled = false,
  onUploaded,
  onUploadError,
  size = 'default',
}: DocumentUploadButtonProps) {
  const { darkMode } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? 'Upload failed');
    }

    return data as DocumentUploadResult;
  };

  const handleFilesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';

    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const selectedFiles = files.slice(0, 5);
      const uploadedDocuments: DocumentUploadResult[] = [];

      for (const file of selectedFiles) {
        if (file.type !== ACCEPTED_DOCUMENT_TYPE) {
          throw new Error('Only PDF files are supported');
        }

        uploadedDocuments.push(await uploadFile(file));
      }

      onUploaded?.(uploadedDocuments);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';

      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

return (
  <div className={cn("relative flex items-end", className)}>
    <input
      ref={inputRef}
      type="file"
      accept=".pdf,application/pdf"
      multiple
      className="hidden"
      onChange={handleFilesSelected}
    />

    <Button
      type="button"
      variant="secondary"
      disabled={disabled || isUploading}
      className={cn(
        "edusync-button-motion border font-bold shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-55",
        darkMode
          ? "border-orange-300/40 bg-orange-500 text-slate-950 shadow-orange-950/30 hover:bg-orange-400 focus-visible:ring-orange-300 focus-visible:ring-offset-slate-950"
          : "border-indigo-300 bg-indigo-600 text-white shadow-indigo-500/25 hover:bg-indigo-700 focus-visible:ring-indigo-600 focus-visible:ring-offset-slate-300",
        size === 'compact'
          ? "h-9 w-9 rounded-xl"
          : "h-12 w-12 rounded-2xl",
      )}
      aria-label="Upload PDF document"
      title="Upload PDF document"
      onClick={() => inputRef.current?.click()}
    >
      {isUploading ? (
        <span className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", size === 'compact' ? "h-4 w-4" : "h-5 w-5")} />
      ) : (
        <DocumentArrowUpIcon className={size === 'compact' ? "h-5 w-5" : "h-7 w-7"} />
      )}
    </Button>
  </div>
);
}
