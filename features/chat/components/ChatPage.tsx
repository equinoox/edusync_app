'use client';

import { useRef, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import Link from 'next/link';
import { SparklesIcon, AcademicCapIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

import { ChatMessages } from '@/features/chat/components/ChatMessages';
import { ChatInput } from '@/features/chat/components/ChatInput';

export function ChatPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    sendMessage({ text: input });
    setInput('');
    setIsLoading(false);
  };

  return (
    <main className="flex h-screen flex-col bg-[#F0EEFF]">

      <header className="shrink-0 border-b border-indigo-100 bg-white/60 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Link href="/home" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">
                Edu<span className="text-indigo-600">Sync</span>
              </span>
            </Link>
            <span className="text-slate-300 font-light">/</span>
            <span className="text-slate-500 text-sm font-medium">AI Assistant</span>
          </div>
          <Link
            href="/home"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors px-4 py-2 rounded-xl hover:bg-white/70 border border-transparent hover:border-indigo-100"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden px-6 py-6 w-full">

        <div className="flex flex-col flex-1 max-w-3xl w-full mx-auto bg-white/70 backdrop-blur-sm rounded-3xl border border-indigo-100 shadow-sm overflow-hidden">

          <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 w-full">
            {messages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center space-y-5 max-w-sm">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200/60">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">EduSync AI</h2>
                    <p className="text-slate-500 text-base leading-relaxed">
                      Ask me anything about your study materials. Im here to help you learn smarter.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2">
                    <SparklesIcon className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-indigo-700">AI-Powered Answers</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <ChatMessages messages={messages} />
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-indigo-100 bg-white/80 px-6 py-4 w-full">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

        </div>
      </div>
    </main>
  );
}