'use client';

import { useRef, useState } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/ui/button';
import { ACCEPTED_DOCUMENT_TYPE } from '@/features/documents/schemas';
import type { DocumentUploadResult } from '@/features/documents/types';
import { cn } from '@/lib/utils';

type DocumentUploadButtonProps = {
  className?: string;
  disabled?: boolean;
  onUploaded?: (documents: DocumentUploadResult[]) => void;
  onUploadError?: (message: string) => void;
  size?: 'default' | 'compact';
};

export function DocumentUploadButton({
  className,
  disabled = false,
  onUploaded,
  onUploadError,
  size = 'default',
}: DocumentUploadButtonProps) {
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
        "bg-orange-500 text-black shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50",
        size === 'compact'
          ? "h-10 w-10 rounded-xl"
          : "h-[52px] w-[52px] rounded-2xl",
      )}
      aria-label="Upload PDF document"
      title="Upload PDF document"
      onClick={() => inputRef.current?.click()}
    >
      {isUploading ? (
        <span className={cn("animate-spin rounded-full border-2 border-white border-t-transparent", size === 'compact' ? "h-4 w-4" : "h-5 w-5")} />
      ) : (
        <DocumentArrowUpIcon className={size === 'compact' ? "h-6 w-6" : "h-8 w-8"} />
      )}
    </Button>
  </div>
);
}
