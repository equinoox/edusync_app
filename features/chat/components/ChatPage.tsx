'use client';

import { useRef, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/providers/ThemeProvider';
import Sidebar from '@/components/layout/sidebar';
import TopBar from '@/components/layout/TopBar';
import SmallBar from '@/components/layout/SmallBar';
import {
  ToastNotification,
  type ToastNotificationState,
} from '@/components/shared/ToastNotification';

import { ChatMessages } from '@/features/chat/components/ChatMessages';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { DocumentUploadButton } from '@/features/documents/components/DocumentUploadButton';
import type { DocumentListItem, DocumentUploadResult } from '@/features/documents/types';

export function ChatPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [toast, setToast] = useState<ToastNotificationState | null>(null);
  const { messages, sendMessage } = useChat();
  const { darkMode } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');

      if (response.ok) {
        setDocuments(await response.json());
      }
    } catch {
      setToast({
        id: Date.now(),
        message: 'Something went wrong',
        tone: 'error',
      });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const handleDocumentsChanged = (event: Event) => {
      const detail = (event as CustomEvent<{
        uploadedDocuments?: DocumentUploadResult[];
        deletedDocumentId?: string;
      }>).detail;

      if (detail?.uploadedDocuments?.length) {
        setDocuments(previousDocuments => {
          const uploadedIds = new Set(
            detail.uploadedDocuments?.map(document => document.id),
          );

          return [
            ...detail.uploadedDocuments!,
            ...previousDocuments.filter(document => !uploadedIds.has(document.id)),
          ];
        });
      }

      if (detail?.deletedDocumentId) {
        setDocuments(previousDocuments =>
          previousDocuments.filter(document => document.id !== detail.deletedDocumentId),
        );
      }
    };

    window.addEventListener('edusync:documents-changed', handleDocumentsChanged);
    window.addEventListener('focus', fetchDocuments);

    return () => {
      window.removeEventListener('edusync:documents-changed', handleDocumentsChanged);
      window.removeEventListener('focus', fetchDocuments);
    };
  }, []);

  useEffect(() => {
    if (
      selectedDocumentId &&
      !documents.some(document => document.id === selectedDocumentId)
    ) {
      setSelectedDocumentId('');
    }
  }, [documents, selectedDocumentId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    sendMessage(
      { text: input },
      { body: selectedDocumentId ? { documentId: selectedDocumentId } : {} },
    ).finally(() => setIsLoading(false));
    setInput('');
  };

  const handleDocumentUploaded = (documents: DocumentUploadResult[]) => {
    setDocuments(previousDocuments => {
      const uploadedIds = new Set(documents.map(document => document.id));
      return [
        ...documents,
        ...previousDocuments.filter(document => !uploadedIds.has(document.id)),
      ];
    });

    const firstDocument = documents[0];
    if (firstDocument) {
      setToast({
        id: Date.now(),
        message: `File uploaded: ${firstDocument.fileName}`,
        tone: 'success',
      });
    }
  };

  const handleDocumentUploadError = () => {
    setToast({
      id: Date.now(),
      message: 'Something went wrong',
      tone: 'error',
    });
  };

  return (
    <main className={`flex h-screen flex-col lg:flex-row transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar sidebarOpen={sidebarOpen} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <SmallBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          actions={
            <DocumentUploadButton
              size="compact"
              onUploaded={handleDocumentUploaded}
              onUploadError={handleDocumentUploadError}
            />
          }
        />

        <div className="hidden lg:block">
          <TopBar pageName="AI Assistant" />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex flex-1 overflow-hidden px-4 sm:px-6 py-4 sm:py-6 w-full">
            <div className={`edusync-enter flex flex-col flex-1 max-w-6xl w-full mx-auto rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>

            <div className="relative flex flex-1 flex-col px-4 sm:px-6 py-4 sm:py-6 w-full min-h-0">
              <div
                className={`absolute inset-0 pointer-events-none ${darkMode ? 'opacity-[0.1]' : 'opacity-[0.09]'}`}
                style={{
                  backgroundImage: "linear-gradient(to right, #6d28d9 1px, transparent 1px), linear-gradient(to bottom, #6d28d9 1px, transparent 1px)",
                  backgroundSize: '32px 32px',
                }}
              />
              {messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="edusync-scale-in text-center space-y-5 max-w-sm">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${darkMode ? 'bg-violet-600 shadow-violet-500/20' : 'bg-indigo-600 shadow-indigo-200/60'}`}>
                      <SparklesIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-3xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        EduSync AI
                      </h2>
                      <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                        Ask me anything about your study materials. Im here to help you learn smarter.
                      </p>
                    </div>
                    <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-2 transition-colors duration-300 ${darkMode ? 'bg-violet-950 border-violet-800' : 'bg-indigo-50 border-indigo-200'}`}>
                      <SparklesIcon className={`w-4 h-4 ${darkMode ? 'text-violet-400' : 'text-indigo-500'}`} />
                      <span className={`text-sm font-medium ${darkMode ? 'text-violet-300' : 'text-indigo-700'}`}>
                        AI-Powered Answers
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col w-full flex-1 min-h-0">
                  <ChatMessages messages={messages} />
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className={`edusync-enter-fast shrink-0 mx-3 mb-3 sm:mx-4 sm:mb-4 rounded-3xl border transition-colors duration-300 ${darkMode ? 'bg-violet-950 border-slate-700' : 'bg-indigo-800 border-gray-400'} px-4 sm:px-6 py-4 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] shadow-lg`}>
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                messages={messages}
                documents={documents}
                selectedDocumentId={selectedDocumentId}
                onSelectedDocumentChange={setSelectedDocumentId}
                onDocumentUploaded={handleDocumentUploaded}
                onDocumentUploadError={handleDocumentUploadError}
              />
            </div>
            </div>
          </div>


        </div>
      </div>
    </main>
  );
}
