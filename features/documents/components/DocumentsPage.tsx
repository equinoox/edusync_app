'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import Sidebar from '@/components/layout/sidebar';
import TopBar from '@/components/layout/TopBar';
import SmallBar from '@/components/layout/SmallBar';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import {
  ToastNotification,
  type ToastNotificationState,
} from '@/components/shared/ToastNotification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/providers/ThemeProvider';
import type { DocumentListItem, DocumentUploadResult } from '@/features/documents/types';
import { DocumentUploadButton } from '@/features/documents/components/DocumentUploadButton';

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function DocumentsPage() {
  const { darkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentListItem | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotificationState | null>(null);
  const [search, setSearch] = useState('');

  const showToast = useCallback((message: string, tone: ToastNotificationState['tone'] = 'info') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/documents');

      if (response.ok) {
        setDocuments(await response.json());
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDocumentsUploaded = (uploadedDocuments: DocumentUploadResult[]) => {
    setDocuments(previousDocuments => {
      const uploadedIds = new Set(uploadedDocuments.map(document => document.id));
      return [
        ...uploadedDocuments,
        ...previousDocuments.filter(document => !uploadedIds.has(document.id)),
      ];
    });

    const firstUploaded = uploadedDocuments[0];
    if (firstUploaded) {
      showToast(`File uploaded: ${firstUploaded.fileName}`, 'success');
    }

    window.dispatchEvent(
      new CustomEvent('edusync:documents-changed', {
        detail: { uploadedDocuments },
      }),
    );
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    setDeletingDocumentId(documentToDelete.id);

    try {
      const response = await fetch(`/api/documents/${documentToDelete.id}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setDocuments(previousDocuments =>
        previousDocuments.filter(document => document.id !== documentToDelete.id),
      );
      window.dispatchEvent(
        new CustomEvent('edusync:documents-changed', {
          detail: { deletedDocumentId: documentToDelete.id },
        }),
      );
      setDocumentToDelete(null);
      showToast('File deleted', 'success');
    } catch {
      showToast('Something went wrong', 'error');
    } finally {
      setDeletingDocumentId(null);
    }
  };

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return documents;

    return documents.filter(document =>
      document.fileName.toLowerCase().includes(normalizedSearch),
    );
  }, [documents, search]);

  return (
    <main className={`flex min-h-screen flex-col lg:flex-row ${darkMode ? 'bg-slate-950' : 'bg-slate-300'}`}>
      <ToastNotification toast={toast} onDismiss={dismissToast} />
      <ConfirmationModal
        isOpen={Boolean(documentToDelete)}
        isLoading={Boolean(deletingDocumentId)}
        message="Are you sure you want to delete this file?"
        onCancel={() => setDocumentToDelete(null)}
        onConfirm={handleDeleteDocument}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar sidebarOpen={sidebarOpen} />
      </div>

      <section className="relative flex min-w-0 flex-1 flex-col">
        <SmallBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="hidden lg:block">
          <TopBar pageName="Documents" />
        </div>

        <div className="absolute right-8 bottom-12 z-20 sm:right-6">
          <DocumentUploadButton
            onUploaded={handleDocumentsUploaded}
            onUploadError={() => showToast('Something went wrong', 'error')}
            size="default"
          />
        </div>

        <div className="w-full px-4 py-6 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 edusync-enter">
            <div
              className={`edusync-card-motion flex flex-col gap-3 rounded-xl border p-4 shadow-md sm:flex-row sm:items-center sm:justify-between ${
                darkMode
                  ? 'border-slate-700 bg-slate-800'
                  : 'border-slate-500 bg-slate-400'
              }`}
            >
              <div>
                <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  Documents
                </h1>
                <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Search uploaded PDFs by file name.
                </p>
              </div>
              <label className="relative block w-full sm:max-w-sm">
                <MagnifyingGlassIcon
                  className={`pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                    darkMode ? 'text-slate-500' : 'text-slate-700'
                  }`}
                />
                <input
                  type="search"
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Search documents"
                  className={`h-11 w-full rounded-xl border py-2 pl-10 pr-3 text-sm outline-none transition focus:ring-2 ${
                    darkMode
                      ? 'border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-violet-400 focus:ring-violet-400/30'
                      : 'border-slate-500 bg-slate-300 text-slate-950 placeholder:text-slate-600 focus:border-indigo-600 focus:ring-indigo-600/30'
                  }`}
                />
              </label>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center">
                <p className={darkMode ? 'text-orange-500' : 'text-slate-600'}>
                  Loading documents...
                </p>
              </div>
            ) : documents.length === 0 ? (
              <Card className={darkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-indigo-400 bg-indigo-500 text-white'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DocumentTextIcon className="h-5 w-5" />
                    No documents yet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={darkMode ? 'text-slate-300' : 'text-indigo-100'}>
                    Upload a PDF from chat or this page and it will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : filteredDocuments.length === 0 ? (
              <Card className={darkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-500 bg-slate-400 text-slate-950'}>
                <CardContent className="p-6 text-center">
                  <DocumentTextIcon className={`mx-auto h-9 w-9 ${darkMode ? 'text-violet-300' : 'text-indigo-700'}`} />
                  <p className="mt-3 text-sm font-semibold">No documents match your search.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {filteredDocuments.map((document, index) => (
                  <Card
                    key={document.id}
                    className={`${darkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-indigo-500 bg-slate-100 text-black'} edusync-enter-fast`}
                    style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}
                  >
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${darkMode ? 'bg-violet-900 text-violet-200' : 'bg-indigo-800 text-white'}`}>
                          <DocumentTextIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="truncate text-sm font-semibold text-inherit">
                            {document.fileName}
                          </h2>
                          <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-indigo-800'}`}>
                            {document.pageCount} pages · {formatFileSize(document.fileSize)}
                          </p>
                        </div>
                      </div>
                      <time className={`text-xs ${darkMode ? 'text-slate-400' : 'text-indigo-800'}`}>
                        {new Date(document.createdAt).toLocaleDateString()}
                      </time>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <a
                          href={`/api/documents/${document.id}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            darkMode
                              ? 'edusync-button-motion inline-flex h-8 w-fit items-center rounded-md bg-violet-950 px-3 text-sm text-white transition-colors hover:bg-violet-800'
                              : 'edusync-button-motion inline-flex h-8 w-fit items-center rounded-md bg-gray-200 px-3 text-sm text-slate-900 transition-colors hover:bg-gray-300'
                          }
                        >
                          Open PDF
                        </a>
                        <button
                          type="button"
                          onClick={() => setDocumentToDelete(document)}
                          disabled={deletingDocumentId === document.id}
                          className={
                            darkMode
                              ? 'edusync-button-motion inline-flex h-8 w-fit items-center rounded-md bg-red-950 px-3 text-sm text-red-100 transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-60'
                              : 'edusync-button-motion inline-flex h-8 w-fit items-center rounded-md bg-red-100 px-3 text-sm text-red-700 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60'
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
