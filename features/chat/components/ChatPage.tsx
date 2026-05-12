'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

import { ChatMessages } from '@/features/chat/components/ChatMessages';
import { ChatInput } from '@/features/chat/components/ChatInput';

export function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    sendMessage({ text: input });
    setInput('');
  };

  return (
    <main>
      <ChatMessages messages={messages} />

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
      />
    </main>
  );
}