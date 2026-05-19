import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ToolCallView } from '@/features/chat/components/ToolCallView';
import type { ChatMessagesProps } from '@/features/chat/types';

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
                    <div key={index} className="markdown-content">
                      {message.role === 'user' ? (
                        <p className="leading-relaxed">{part.text}</p>
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-3 mb-2 text-indigo-700" {...props} />,
                            h4: ({node, ...props}) => <h4 className="text-base font-semibold mt-2 mb-1 text-indigo-600" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="ml-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-indigo-700" {...props} />,
                            em: ({node, ...props}) => <em className="italic text-slate-700" {...props} />,
                            code: ({node, inline, ...props}: any) => (
                              inline ? (
                                <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                              ) : (
                                <code className="block bg-slate-100 text-slate-800 p-3 rounded-lg overflow-x-auto text-sm font-mono mb-2" {...props} />
                              )
                            ),
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-300 pl-3 italic text-slate-600 my-2" {...props} />,
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      )}
                    </div>
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