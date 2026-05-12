import type { UIMessage } from 'ai';

import { ToolCallView } from '@/features/chat/components/ToolCallView';

type ChatMessagesProps = {
  messages: UIMessage[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <strong>{message.role}</strong>

          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <p key={index}>{part.text}</p>;

              case 'tool-addResource':
              case 'tool-getInformation':
                return <ToolCallView key={index} part={part} />;

              default:
                return null;
            }
          })}
        </div>
      ))}
    </div>
  );
}