'use client';

import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';

type ToolCallViewProps = {
  part: {
    type: string;
    toolName?: string;
    state?: string;
    input?: unknown;
  };
};

const TOOL_DESCRIPTIONS: Record<string, (input: unknown) => string> = {
  'GetInformation': (input: unknown) => {
    const params = input as Record<string, unknown>;
    return `🔍 Searching your materials for: "${params.query || 'information'}"`;
  },
  'AddResource': (input: unknown) => {
    const params = input as Record<string, unknown>;
    return `📚 Adding new resource: "${params.title || 'Untitled'}"`;
  },
  'SearchResources': (input: unknown) => {
    const params = input as Record<string, unknown>;
    return `🔎 Searching resources for: "${params.query || 'content'}"`;
  },
  'AnalyzeDocument': (input: unknown) => {
    const params = input as Record<string, unknown>;
    return `📖 Analyzing document: "${params.documentId || 'document'}"`;
  },
  'CreateSummary': (input: unknown) => {
    const params = input as Record<string, unknown>;
    return `✍️ Creating summary for: "${params.topic || 'content'}"`;
  },
  'GetStudyTips': (input: unknown) => {
    const params = input as Record<string, unknown>;
    return `💡 Finding study tips for: "${params.subject || 'topic'}"`;
  },
};

export function ToolCallView({ part }: ToolCallViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toolName = String(part.type).replace('tool-', '').trim() || (part.toolName as string) || 'Tool';
  
  const capitalizedToolName = toolName.charAt(0).toUpperCase() + toolName.slice(1);
  
  const description = TOOL_DESCRIPTIONS[capitalizedToolName]?.(part.input) || `Using tool: ${toolName}`;

  const isCompleted = part.state === 'result' || part.state === 'output-available' || part.state?.includes('output') || part.state?.includes('result');
  const status = isCompleted ? 'Completed' : 'Running';
  
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group w-fit flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all duration-200 cursor-pointer"
        title="Click to see tool details"
      >
        <SparklesIcon className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-medium text-indigo-700">
          {isExpanded ? '▼ Tool Details' : '▶ Tool Used'}
        </span>
      </button>

      {isExpanded && (
        <div className="ml-4 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm text-slate-700 font-medium">
            {description}
          </p>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
              status === 'Completed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {status === 'Running' && <div className="w-2 h-2 bg-current rounded-full mr-1 animate-pulse" />}
              {status}
            </span>
          </div>

          <div className="text-xs text-slate-500 pt-1 border-t border-slate-200">
            <span className="font-mono">{toolName}</span>
          </div>
        </div>
      )}
    </div>
  );
}