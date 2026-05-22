import dynamic from 'next/dynamic';
import { useTheme } from '@/providers/ThemeProvider';
import { ToolCallView } from '@/features/chat/components/ToolCallView';
import type { ChatMessagesProps } from '@/features/chat/types';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

export function ChatMessages({ messages }: ChatMessagesProps) {
  const { darkMode } = useTheme();
  return (
    <div className="flex flex-col w-full gap-4 flex-1 min-h-0 overflow-y-auto pr-3">
      {messages.map(message => {
        const hasParts = Array.isArray(message.parts);
        const textParts = hasParts ? message.parts.filter(part => part.type === 'text') : [];
        const toolParts = hasParts
          ? message.parts.filter(part => part.type.startsWith('tool-'))
          : [];
        const messageContent = (message as unknown as { content?: string }).content;
        const fallbackText = !hasParts && typeof messageContent === 'string'
          ? messageContent
          : '';

        return (
          <div key={message.id} className="flex flex-col w-full gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {(textParts.length > 0 || fallbackText.length > 0) && (
              <div
                className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role !== 'user' && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md shrink-0 mr-3 mt-0.5 ${
                    darkMode ? 'bg-violet-600' : 'bg-indigo-600'
                  }`}>
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
                      ? 'bg-indigo-600 text-white  shadow-indigo-200/50'
                      : darkMode
                      ? 'bg-slate-700 text-slate-50 border border-slate-600 shadow-sm'
                      : 'bg-white/80 backdrop-blur-sm text-slate-800 border border-indigo-100 shadow-sm'
                  }`}
                >
                  {textParts.length > 0 ? (
                    textParts.map((part, index) => (
                      <div key={index} className="markdown-content">
                        {message.role === 'user' ? (
                          <p className="leading-relaxed">{part.text}</p>
                        ) : (
                          <ReactMarkdown
                            components={{
                              h3: ({node, ...props}) => <h3 className={`text-lg font-bold mt-3 mb-2 ${darkMode ? 'text-violet-300' : 'text-indigo-700'}`} {...props} />,
                              h4: ({node, ...props}) => <h4 className={`text-base font-semibold mt-2 mb-1 ${darkMode ? 'text-violet-200' : 'text-indigo-600'}`} {...props} />,
                              p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-inside mb-2 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="ml-2" {...props} />,
                              strong: ({node, ...props}) => <strong className={`font-bold ${darkMode ? 'text-orange-500' : 'text-indigo-700'}`} {...props} />,
                              em: ({node, ...props}) => <em className={`italic ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} {...props} />,
                              code: ({node, inline, ...props}: any) => (
                                inline ? (
                                  <code className={`bg-indigo-50 px-1.5 py-0.5 rounded text-sm font-mono ${darkMode ? 'bg-slate-600 text-violet-200' : 'text-indigo-700'}`} {...props} />
                                ) : (
                                  <code className={`block p-3 rounded-lg overflow-x-auto text-sm font-mono mb-2 ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'}`} {...props} />
                                )
                              ),
                              blockquote: ({node, ...props}) => <blockquote className={`border-l-4 pl-3 italic my-2 ${darkMode ? 'border-violet-500 text-slate-300' : 'border-indigo-300 text-slate-600'}`} {...props} />,
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="markdown-content">
                      {message.role === 'user' ? (
                        <p className="leading-relaxed">{fallbackText}</p>
                      ) : (
                          <ReactMarkdown
                            components={{
                            h3: ({node, ...props}) => <h3 className={`text-lg font-bold mt-3 mb-2 ${darkMode ? 'text-violet-300' : 'text-indigo-700'}`} {...props} />,
                            h4: ({node, ...props}) => <h4 className={`text-base font-semibold mt-2 mb-1 ${darkMode ? 'text-violet-200' : 'text-indigo-600'}`} {...props} />,
                            p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-inside mb-2 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="ml-2" {...props} />,
                            strong: ({node, ...props}) => <strong className={`font-bold ${darkMode ? 'text-orange-500' : 'text-indigo-700'}`} {...props} />,
                            em: ({node, ...props}) => <em className={`italic ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} {...props} />,
                            code: ({node, inline, ...props}: any) => (
                              inline ? (
                                <code className={`bg-indigo-50 px-1.5 py-0.5 rounded text-sm font-mono ${darkMode ? 'bg-slate-600 text-violet-200' : 'text-indigo-700'}`} {...props} />
                              ) : (
                                <code className={`block p-3 rounded-lg overflow-x-auto text-sm font-mono mb-2 ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'}`} {...props} />
                              )
                            ),
                            blockquote: ({node, ...props}) => <blockquote className={`border-l-4 pl-3 italic my-2 ${darkMode ? 'border-violet-500 text-slate-300' : 'border-indigo-300 text-slate-600'}`} {...props} />,
                          }}
                        >
                          {fallbackText}
                        </ReactMarkdown>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {toolParts.length > 0 && message.role !== 'user' && (
              <div className="flex justify-start gap-3 z-10">
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