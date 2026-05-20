'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import Link from 'next/link';
import { SparklesIcon, AcademicCapIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/providers/ThemeProvider';
import Sidebar from '@/components/layout/sidebar';
import { UserButton } from '@clerk/nextjs';

import { ChatMessages } from '@/features/chat/components/ChatMessages';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { ChatHistory } from '@/features/chat/components/ChatHistory';

export function ChatPage() {
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [isSavingHistory, setIsSavingHistory] = useState(false);
  const lastPersistedMessageCountRef = useRef(0);
  const skipNextPersistRef = useRef(false);
  const wasChatLoadingRef = useRef(false);

  const chat = useChat() as unknown as {
    messages: Array<{ id?: string; role: string; content?: string; parts?: Array<{ type?: string; text?: string }> }>;
    sendMessage: (message: { text: string }) => void;
    setMessages: (messages: Array<{ id?: string; role: string; content?: string; parts?: Array<{ type?: string; text?: string }> }>) => void;
    isLoading: boolean;
  };

  const { messages, sendMessage, setMessages, isLoading: chatIsLoading } = chat;
  const { darkMode } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const wasLoading = wasChatLoadingRef.current;
    wasChatLoadingRef.current = chatIsLoading;

    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }

    if (chatIsLoading || !wasLoading) {
      return;
    }

    if (!currentSessionId || messages.length === 0) {
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') {
      return;
    }

    if (messages.length === lastPersistedMessageCountRef.current) {
      return;
    }

    const persistCurrentTurn = async () => {
      try {
        setIsSavingHistory(true);
        const response = await fetch(`/api/chat/sessions/${currentSessionId}/turn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
          throw new Error('Failed to save chat turn');
        }

        lastPersistedMessageCountRef.current = messages.length;
        setHistoryRefreshKey((value) => value + 1);
      } catch (error) {
        console.error('Failed to persist chat turn:', error);
      } finally {
        setIsSavingHistory(false);
      }
    };

    void persistCurrentTurn();
  }, [chatIsLoading, currentSessionId, messages]);

  const handleSelectSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to load session');
      }

      const data = (await response.json()) as {
        session: {
          id: string;
          messages: Array<{ id?: string; role: string; content?: string }>;
        };
      };

      setCurrentSessionId(data.session.id);
      skipNextPersistRef.current = true;
      wasChatLoadingRef.current = false;
      setMessages(
        data.session.messages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
        }))
      );
      setInput('');
      lastPersistedMessageCountRef.current = data.session.messages.length;
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    skipNextPersistRef.current = false;
    wasChatLoadingRef.current = false;
    setMessages([]);
    setInput('');
    lastPersistedMessageCountRef.current = 0;
    setHistoryRefreshKey((value) => value + 1);
  };

  const ensureSessionExists = async (initialMessage: string) => {
    if (currentSessionId) {
      return currentSessionId;
    }

    const response = await fetch('/api/chat/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initialMessage }),
    });

    if (!response.ok) {
      throw new Error('Failed to create chat session');
    }

    const data = (await response.json()) as {
      session: { id: string };
    };

    setCurrentSessionId(data.session.id);
    skipNextPersistRef.current = false;
    wasChatLoadingRef.current = false;
    setHistoryRefreshKey((value) => value + 1);
    return data.session.id;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    try {
      await ensureSessionExists(trimmedInput);
      sendMessage({ text: trimmedInput });
      setInput('');
    } catch (error) {
      console.error('Failed to submit chat message:', error);
    }
  };

  return (
    <main className={`flex h-screen flex-col lg:flex-row transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
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
        <header className={`shrink-0 border-b transition-colors duration-300 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-indigo-800 border-gray-200'} px-6 py-4 shadow-sm`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/home" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${darkMode ? 'bg-violet-600' : 'bg-indigo-600'}`}>
                  <AcademicCapIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    <span className="text-white">Edu</span><span className={darkMode ? 'text-violet-600' : 'text-orange-600'}>Sync</span>
                  </div>
                  <div className={`text-xs font-medium ${darkMode ? 'text-gray-100' : 'text-gray-100'}`}>
                    AI Assistant
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg transition-colors lg:hidden ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
              >
                {sidebarOpen ? (
                  <XMarkIcon className={`w-6 h-6 ${darkMode ? 'text-violet-400' : 'text-slate-600'}`} />
                ) : (
                  <Bars3Icon className={`w-6 h-6 ${darkMode ? 'text-violet-400' : 'text-slate-600'}`} />
                )}
              </button>
              <div className="scale-125 origin-center">
                <UserButton />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 overflow-hidden px-4 sm:px-6 py-4 sm:py-6 w-full">
            <div className={`flex flex-col flex-1 max-w-6xl w-full mx-auto rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="relative flex flex-1 flex-col overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 w-full">
                <div
                  className={`absolute inset-0 pointer-events-none ${darkMode ? 'opacity-[0.1]' : 'opacity-[0.09]'}`}
                  style={{
                    backgroundImage: 'linear-gradient(to right, #6d28d9 1px, transparent 1px), linear-gradient(to bottom, #6d28d9 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
                {messages.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center">
                    <div className="text-center space-y-5 max-w-sm">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl ${darkMode ? 'bg-violet-600 shadow-violet-500/20' : 'bg-indigo-600 shadow-indigo-200/60'}`}>
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
                  <div className="flex flex-col w-full">
                    <ChatMessages messages={messages as any} />
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className={`shrink-0 border-t transition-colors duration-300 ${darkMode ? 'bg-violet-950 border-slate-700' : 'bg-indigo-800 border-gray-400'} px-4 sm:px-6 py-4 w-full`}>
                <ChatInput
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  isLoading={chatIsLoading || isSavingHistory}
                  messages={messages as any}
                />
              </div>
            </div>
          </div>

          <div className="hidden xl:flex">
            <ChatHistory
              currentSessionId={currentSessionId}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              refreshKey={historyRefreshKey}
            />
          </div>
        </div>
      </div>
    </main>
  );
}