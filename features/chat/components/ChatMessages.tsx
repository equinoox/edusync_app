import type { UIMessage } from 'ai';
import { ToolCallView } from '@/features/chat/components/ToolCallView';

type ChatMessagesProps = {
  messages: UIMessage[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      {messages.map(message => {
        const textParts = message.parts.filter(part => part.type === 'text');
        const toolParts = message.parts.filter(part => part.type.startsWith('tool-'));

        return (
          <div key={message.id} className="flex flex-col w-full gap-3">
            {textParts.length > 0 && (
              <div
                className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role !== 'user' && (
                  <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shrink-0 mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                )}

                <div
                  className={`max-w-[70%] rounded-2xl px-5 py-3.5 text-base leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50'
                      : 'bg-white/80 backdrop-blur-sm text-slate-800 border border-indigo-100 shadow-sm'
                  }`}
                >
                  {textParts.map((part, index) => (
                    <p key={index} className="leading-relaxed">{part.text}</p>
                  ))}
                </div>
              </div>
            )}

            {toolParts.length > 0 && message.role !== 'user' && (
              <div className="flex justify-start gap-3">
                <div className="w-8 h-8 shrink-0" />
                <div className="flex flex-col gap-2">
                  {toolParts.map((part, index) => (
                    <ToolCallView key={index} part={part} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}