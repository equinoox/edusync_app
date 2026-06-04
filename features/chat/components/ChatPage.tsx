'use client';

import { useRef, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/providers/ThemeProvider';
import Sidebar from '@/components/layout/sidebar';
import TopBar from '@/components/layout/TopBar';
import SmallBar from '@/components/layout/SmallBar';
import {
  ToastNotification,
  type ToastNotificationState,
} from '@/components/shared/ToastNotification';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';

import { ChatMessages } from '@/features/chat/components/ChatMessages';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { DocumentUploadButton } from '@/features/documents/components/DocumentUploadButton';
import type { SavedChatMessage } from '@/features/chat/types';
import type { DocumentListItem, DocumentUploadResult } from '@/features/documents/types';

const toUiMessage = (message: SavedChatMessage): UIMessage => ({
  id: message.id,
  role: message.role,
  parts: [{ type: 'text', text: message.content }],
});

export function ChatPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  const [isClearHistoryConfirmOpen, setIsClearHistoryConfirmOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [toast, setToast] = useState<ToastNotificationState | null>(null);
  const { messages, setMessages, sendMessage } = useChat({
    onError: () => {
      setToast({
        id: Date.now(),
        message: 'Something went wrong',
        tone: 'error',
      });
    },
  });
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
        return;
      }

      setToast({
        id: Date.now(),
        message: 'Unable to load documents',
        tone: 'error',
        statusCode: response.status,
      });
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
    let isMounted = true;

    const fetchChatHistory = async () => {
      try {
        const response = await fetch('/api/chat/history');

        if (!response.ok) {
          if (isMounted) {
            setToast({
              id: Date.now(),
              message: 'Unable to load chat history',
              tone: 'error',
              statusCode: response.status,
            });
          }
          return;
        }

        const savedMessages = (await response.json()) as SavedChatMessage[];

        if (isMounted) {
          setMessages(savedMessages.map(toUiMessage));
        }
      } catch {
        if (isMounted) {
          setToast({
            id: Date.now(),
            message: 'Unable to load chat history',
            tone: 'error',
          });
        }
      } finally {
        if (isMounted) {
          setIsHistoryLoading(false);
        }
      }
    };

    void fetchChatHistory();

    return () => {
      isMounted = false;
    };
  }, [setMessages]);

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
    if (isHistoryLoading || !input.trim()) return;
    setIsLoading(true);
    sendMessage(
      { text: input },
      { body: selectedDocumentId ? { documentId: selectedDocumentId } : {} },
    ).finally(() => setIsLoading(false));
    setInput('');
  };

  const handleClearChat = async () => {
    if (isClearingHistory) {
      return;
    }

    setIsClearingHistory(true);

    try {
      const response = await fetch('/api/chat/history', { method: 'DELETE' });

      if (!response.ok) {
        setToast({
          id: Date.now(),
          message: 'Unable to clear chat',
          tone: 'error',
          statusCode: response.status,
        });
        return;
      }

      setMessages([]);
      setIsClearHistoryConfirmOpen(false);
      setToast({
        id: Date.now(),
        message: 'Chat cleared',
        tone: 'success',
      });
    } catch {
      setToast({
        id: Date.now(),
        message: 'Unable to clear chat',
        tone: 'error',
      });
    } finally {
      setIsClearingHistory(false);
    }
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
      <ConfirmationModal
        isOpen={isClearHistoryConfirmOpen}
        isLoading={isClearingHistory}
        message="Clear your saved chat messages?"
        loadingLabel="Clearing..."
        onCancel={() => setIsClearHistoryConfirmOpen(false)}
        onConfirm={handleClearChat}
      />

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
          <div className="flex flex-1 overflow-hidden px-3 py-4 sm:px-5 w-full">
            <div className={`edusync-enter flex flex-col flex-1 max-w-5xl w-full mx-auto rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>

            <div className="relative flex flex-1 flex-col px-4 py-4 sm:px-5 w-full min-h-0">
              <div
                className={`absolute inset-0 pointer-events-none ${darkMode ? 'opacity-[0.1]' : 'opacity-[0.09]'}`}
                style={{
                  backgroundImage: "linear-gradient(to right, #6d28d9 1px, transparent 1px), linear-gradient(to bottom, #6d28d9 1px, transparent 1px)",
                  backgroundSize: '32px 32px',
                }}
              />
              {messages.length > 0 && (
                <div className="relative z-10 mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsClearHistoryConfirmOpen(true)}
                    disabled={isClearingHistory}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                      darkMode
                        ? 'border-slate-600 bg-slate-900/70 text-slate-300 hover:border-violet-500 hover:text-white'
                        : 'border-slate-200 bg-white/80 text-slate-600 hover:border-indigo-300 hover:text-slate-900'
                    }`}
                  >
                    {isClearingHistory ? 'Clearing...' : 'Clear chat'}
                  </button>
                </div>
              )}
              {isHistoryLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="edusync-scale-in text-center space-y-4 max-w-sm">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${darkMode ? 'bg-violet-600 shadow-violet-500/20' : 'bg-indigo-600 shadow-indigo-200/60'}`}>
                      <SparklesIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        EduSync AI
                      </h2>
                      <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
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

            <div className={`edusync-enter-fast shrink-0 mx-3 mb-3 rounded-3xl border transition-colors duration-300 ${darkMode ? 'bg-violet-950 border-slate-700' : 'bg-white border-slate-200'} px-4 sm:px-5 py-3.5 w-[calc(100%-1.5rem)] shadow-lg`}>
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                isLoading={isLoading || isHistoryLoading}
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
