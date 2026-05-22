'use client';

import { useEffect, useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

import Sidebar from '@/components/layout/sidebar';
import TopBar from '@/components/layout/TopBar';
import SmallBar from '@/components/layout/SmallBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/providers/ThemeProvider';
import type { DocumentListItem } from '@/features/documents/types';
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

  return (
    <main className={`flex min-h-screen flex-col lg:flex-row ${darkMode ? 'bg-slate-950' : 'bg-slate-300'}`}>
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

        <div className="fixed bottom-4 right-4 z-20 sm:bottom-6 sm:right-6">
          <DocumentUploadButton onUploaded={fetchDocuments} size="default" />
        </div>

        <div className="w-full px-4 py-6 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-4">
            {isLoading ? (
              <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                Loading documents...
              </p>
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
            ) : (
              <div className="grid gap-3">
                {documents.map(document => (
                  <Card
                    key={document.id}
                    className={darkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-indigo-400 bg-indigo-500 text-black'}
                  >
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${darkMode ? 'bg-violet-900 text-violet-200' : 'bg-indigo-400 text-black'}`}>
                          <DocumentTextIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="truncate text-sm font-semibold text-inherit">
                            {document.fileName}
                          </h2>
                          <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-indigo-100'}`}>
                            {document.pageCount} pages · {formatFileSize(document.fileSize)}
                          </p>
                        </div>
                      </div>
                      <time className={`text-xs ${darkMode ? 'text-slate-400' : 'text-indigo-100'}`}>
                        {new Date(document.createdAt).toLocaleDateString()}
                      </time>
                      <a
                        href={`/api/documents/${document.id}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          darkMode
                            ? 'inline-flex shrink-0 w-fit rounded-md bg-violet-950 px-3 py-1 text-sm text-white transition-colors hover:bg-violet-800'
                            : 'inline-flex shrink-0 w-fit rounded-md bg-gray-200 px-3 py-1 text-sm text-slate-900 transition-colors hover:bg-gray-300'
                        }
                      >
                        Open PDF
                      </a>
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
