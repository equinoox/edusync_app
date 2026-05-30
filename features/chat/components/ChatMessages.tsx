import dynamic from 'next/dynamic';
import { useTheme } from '@/providers/ThemeProvider';
import { ToolCallView } from '@/features/chat/components/ToolCallView';
import type { ChatMessagesProps } from '@/features/chat/types';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

const isFenceLine = (line: string) => line.trim().startsWith('```');

const isTableLine = (line: string) => {
  const trimmed = line.trim();
  if (!trimmed) return false;

  return (
    trimmed.includes('|') ||
    trimmed.includes('\t') ||
    trimmed.split(/\s{2,}/).filter(Boolean).length >= 3
  );
};

const isCodeLine = (line: string) =>
  /^\s{2,}\S/.test(line) ||
  /^\s*(import|export|const|let|var|function|class|def|if|else|for|while|return)\b/.test(line) ||
  /[{};]\s*$/.test(line);

const isFormulaLine = (line: string) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 180) return false;

  return (
    /[\u2211\u03a3\u221a\u03c0\u00b1\u2264\u2265\u2260\u222b]/.test(trimmed) ||
    /\b(alpha|beta|gamma|delta|theta|lambda|mu|pi|rho|sigma|tau|phi|chi|psi|omega|infinity|integral|sqrt|sum)\b.*[=+\-*/^<>]/i.test(trimmed) ||
    /\b[A-Za-z][A-Za-z0-9_]*\s*=\s*[-+*/^()A-Za-z0-9_.\s]+/.test(trimmed) ||
    /\b[A-Za-z]\s*\^\s*\d+/.test(trimmed)
  );
};

const mathAliases: Record<string, string> = {
  alpha: '\u03b1',
  beta: '\u03b2',
  gamma: '\u03b3',
  delta: '\u03b4',
  epsilon: '\u03b5',
  zeta: '\u03b6',
  eta: '\u03b7',
  theta: '\u03b8',
  iota: '\u03b9',
  kappa: '\u03ba',
  lambda: '\u03bb',
  mu: '\u03bc',
  nu: '\u03bd',
  xi: '\u03be',
  omicron: '\u03bf',
  pi: '\u03c0',
  rho: '\u03c1',
  sigma: '\u03c3',
  tau: '\u03c4',
  upsilon: '\u03c5',
  phi: '\u03c6',
  chi: '\u03c7',
  psi: '\u03c8',
  omega: '\u03c9',
  Alpha: '\u0391',
  Beta: '\u0392',
  Gamma: '\u0393',
  Delta: '\u0394',
  Epsilon: '\u0395',
  Zeta: '\u0396',
  Eta: '\u0397',
  Theta: '\u0398',
  Iota: '\u0399',
  Kappa: '\u039a',
  Lambda: '\u039b',
  Mu: '\u039c',
  Nu: '\u039d',
  Xi: '\u039e',
  Omicron: '\u039f',
  Pi: '\u03a0',
  Rho: '\u03a1',
  Sigma: '\u03a3',
  Tau: '\u03a4',
  Upsilon: '\u03a5',
  Phi: '\u03a6',
  Chi: '\u03a7',
  Psi: '\u03a8',
  Omega: '\u03a9',
  sqrt: '\u221a',
  root: '\u221a',
  sum: '\u2211',
  product: '\u220f',
  prod: '\u220f',
  integral: '\u222b',
  int: '\u222b',
  infinity: '\u221e',
  inf: '\u221e',
  approx: '\u2248',
  neq: '\u2260',
  ne: '\u2260',
  leq: '\u2264',
  geq: '\u2265',
  pm: '\u00b1',
  plusminus: '\u00b1',
  times: '\u00d7',
  cdot: '\u22c5',
  divide: '\u00f7',
  partial: '\u2202',
  nabla: '\u2207',
  grad: '\u2207',
  degree: '\u00b0',
  therefore: '\u2234',
  because: '\u2235',
  proportional: '\u221d',
  notin: '\u2209',
  subset: '\u2282',
  subseteq: '\u2286',
  union: '\u222a',
  intersection: '\u2229',
  emptyset: '\u2205',
  forall: '\u2200',
  exists: '\u2203',
  angle: '\u2220',
  perpendicular: '\u22a5',
  parallel: '\u2225',
  implies: '\u21d2',
  iff: '\u21d4',
  leftarrow: '\u2190',
  rightarrow: '\u2192',
  leftrightarrow: '\u2194',
};

const normalizeMathText = (value: unknown) => {
  const text = Array.isArray(value) ? value.join('') : String(value ?? '');

  return text
    .replace(/\\([A-Za-z]+)/g, (_, name: string) => mathAliases[name] ?? mathAliases[name.toLowerCase()] ?? name)
    .replace(
      /\b(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|sqrt|root|sum|product|prod|integral|int|infinity|inf|approx|neq|ne|leq|geq|pm|plusminus|times|cdot|divide|partial|nabla|grad|degree|therefore|because|proportional|notin|subseteq|subset|union|intersection|emptyset|forall|exists|angle|perpendicular|parallel|implies|iff|leftarrow|rightarrow|leftrightarrow)\b/g,
      match => mathAliases[match] ?? match,
    )
    .replace(
      /\b(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)\b/g,
      match => mathAliases[match] ?? match,
    )
    .replace(/<->/g, '\u2194')
    .replace(/<=/g, '\u2264')
    .replace(/>=/g, '\u2265')
    .replace(/!=/g, '\u2260')
    .replace(/\+\/-/g, '\u00b1')
    .replace(/->/g, '\u2192')
    .replace(/<-/g, '\u2190');
};
const wrapStructuredText = (text: string) => {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const output: string[] = [];
  let index = 0;
  let insideFence = false;

  const collect = (predicate: (line: string) => boolean) => {
    const block: string[] = [];

    while (index < lines.length && predicate(lines[index])) {
      block.push(lines[index]);
      index += 1;
    }

    return block;
  };

  while (index < lines.length) {
    const line = lines[index];

    if (isFenceLine(line)) {
      insideFence = !insideFence;
      output.push(line);
      index += 1;
      continue;
    }

    if (insideFence || !line.trim()) {
      output.push(line);
      index += 1;
      continue;
    }

    if (isTableLine(line) && isTableLine(lines[index + 1] ?? '')) {
      output.push('```table', ...collect(isTableLine), '```');
      continue;
    }

    if (isCodeLine(line) && isCodeLine(lines[index + 1] ?? '')) {
      output.push('```code', ...collect(currentLine => currentLine.trim() === '' || isCodeLine(currentLine)), '```');
      continue;
    }

    if (isFormulaLine(line)) {
      output.push('```math', ...collect(isFormulaLine), '```');
      continue;
    }

    output.push(line);
    index += 1;
  }

  return output.join('\n');
};

const getMarkdownComponents = (darkMode: boolean) => ({
  h3: ({node, ...props}: any) => <h3 className={`text-lg font-bold mt-3 mb-2 ${darkMode ? 'text-violet-300' : 'text-indigo-700'}`} {...props} />,
  h4: ({node, ...props}: any) => <h4 className={`text-base font-semibold mt-2 mb-1 ${darkMode ? 'text-violet-200' : 'text-indigo-600'}`} {...props} />,
  p: ({node, ...props}: any) => <p className="mb-2 leading-relaxed" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-inside mb-2 space-y-1" {...props} />,
  li: ({node, ...props}: any) => <li className="ml-2" {...props} />,
  strong: ({node, ...props}: any) => <strong className={`font-bold ${darkMode ? 'text-orange-500' : 'text-indigo-700'}`} {...props} />,
  em: ({node, ...props}: any) => <em className={`italic ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} {...props} />,
  code: ({node, inline, className, children, ...props}: any) => {
    const language = String(className ?? '').replace('language-', '');
    const isMath = language === 'math';
    const isTable = language === 'table';

    if (inline) {
      return (
        <code
          className={`rounded px-1.5 py-0.5 font-mono text-sm ${darkMode ? 'bg-slate-600 text-violet-200' : 'bg-indigo-50 text-indigo-700'}`}
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className={`mb-2 block overflow-x-auto whitespace-pre rounded-lg border p-3 font-mono text-sm ${
          isMath
            ? darkMode
              ? 'border-violet-700 bg-violet-950/50 text-violet-100'
              : 'border-indigo-200 bg-indigo-50 text-indigo-900'
            : isTable
              ? darkMode
                ? 'border-slate-600 bg-slate-800 text-slate-100'
                : 'border-slate-200 bg-slate-50 text-slate-900'
              : darkMode
                ? 'border-slate-700 bg-slate-800 text-slate-200'
                : 'border-slate-200 bg-slate-100 text-slate-800'
        }`}
        {...props}
      >
        {isMath ? normalizeMathText(children) : children}
      </code>
    );
  },
  blockquote: ({node, ...props}: any) => <blockquote className={`border-l-4 pl-3 italic my-2 ${darkMode ? 'border-violet-500 text-slate-300' : 'border-indigo-300 text-slate-600'}`} {...props} />,
});

export function ChatMessages({ messages }: ChatMessagesProps) {
  const { darkMode } = useTheme();
  const markdownComponents = getMarkdownComponents(darkMode);

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
          <div key={message.id} className="edusync-enter-fast flex flex-col w-full gap-3">
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
                  className={`edusync-card-motion max-w-[76%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[70%] ${
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
                            components={markdownComponents}
                          >
                            {wrapStructuredText(part.text)}
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
                            components={markdownComponents}
                        >
                          {wrapStructuredText(fallbackText)}
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
