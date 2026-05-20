'use client';

import { useRef, useState } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/ui/button';
import { ACCEPTED_DOCUMENT_TYPE } from '@/features/documents/schemas';

type DocumentUploadButtonProps = {
  disabled?: boolean;
  onUploaded?: () => void;
};

export function DocumentUploadButton({
  disabled = false,
  onUploaded,
}: DocumentUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isMessageVisible, setIsMessageVisible] = useState(false);

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
  };

  const handleFilesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';

    if (files.length === 0) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const selectedFiles = files.slice(0, 5);

      for (const file of selectedFiles) {
        if (file.type !== ACCEPTED_DOCUMENT_TYPE) {
          throw new Error('Only PDF files are supported');
        }

        await uploadFile(file);
      }

      setMessage(
        selectedFiles.length === 1
          ? 'Document uploaded'
          : `${selectedFiles.length} documents uploaded`,
      );
      setIsMessageVisible(true);

      setTimeout(() => {
        setIsMessageVisible(false);
      }, 2500);

      setTimeout(() => {
        setMessage(null);
      }, 3200);
      onUploaded?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';

      setMessage(errorMessage);
      setIsMessageVisible(true);

      setTimeout(() => {
        setIsMessageVisible(false);
      }, 2500);

      setTimeout(() => {
        setMessage(null);
      }, 3200);
    } finally {
      setIsUploading(false);
    }
  };

  const statusMessage = isUploading ? 'Gathering data...' : message;
  const shouldShowStatusMessage = isUploading || message;
  const statusMessageClassName = isUploading ? 'text-violet-200' : 'text-white';

return (
  <div className="relative flex items-end">
    {shouldShowStatusMessage && (
      <p
        className={`
          absolute bottom-full left-1/2 mb-2 w-max max-w-48
          -translate-x-1/2 rounded-full
          bg-orange-100 px-3 py-1
          text-xs font-medium text-orange-700
          shadow-sm transition-opacity duration-700
          dark:bg-orange-500/15 dark:text-orange-200
          ${isUploading || isMessageVisible ? 'opacity-100' : 'opacity-0'}
        `}
        aria-live="polite"
      >
        {statusMessage}
      </p>
    )}

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
      className="
        h-[52px] w-[52px] rounded-2xl
        bg-orange-500 text-black
        shadow-sm transition
        hover:bg-orange-600
        disabled:cursor-not-allowed disabled:opacity-50
      "
      aria-label="Upload PDF document"
      title="Upload PDF document"
      onClick={() => inputRef.current?.click()}
    >
      {isUploading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <DocumentArrowUpIcon className="h-8 w-8" />
      )}
    </Button>
  </div>
);
}
