'use client';

import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import type { ToolCallViewProps } from '@/features/chat/types';

const getParams = (input: unknown): Record<string, unknown> => {
  if (!input || typeof input !== 'object') {
    return {};
  }

  return input as Record<string, unknown>;
};

const getToolName = (part: ToolCallViewProps['part']) => {
  if (part.toolName) {
    return part.toolName;
  }

  if (part.type) {
    return part.type.replace(/^tool-/, '').trim();
  }

  return 'tool';
};

const TOOL_DESCRIPTIONS: Record<string, (input: unknown) => string> = {
  getInformation: (input: unknown) => {
    const params = getParams(input);

    return `Searching your materials for: "${String(
      params.question ?? params.query ?? 'information'
    )}"`;
  },

  GetInformation: (input: unknown) => {
    const params = getParams(input);

    return `Searching your materials for: "${String(
      params.question ?? params.query ?? 'information'
    )}"`;
  },

  addResource: (input: unknown) => {
    const params = getParams(input);

    return `Adding new resource: "${String(
      params.content ?? params.title ?? 'new resource'
    )}"`;
  },

  AddResource: (input: unknown) => {
    const params = getParams(input);

    return `Adding new resource: "${String(
      params.content ?? params.title ?? 'new resource'
    )}"`;
  },

  searchResources: (input: unknown) => {
    const params = getParams(input);

    return `Searching resources for: "${String(
      params.query ?? params.question ?? 'content'
    )}"`;
  },

  SearchResources: (input: unknown) => {
    const params = getParams(input);

    return `Searching resources for: "${String(
      params.query ?? params.question ?? 'content'
    )}"`;
  },

  analyzeDocument: (input: unknown) => {
    const params = getParams(input);

    return `Analyzing document: "${String(
      params.documentId ?? params.id ?? 'document'
    )}"`;
  },

  AnalyzeDocument: (input: unknown) => {
    const params = getParams(input);

    return `Analyzing document: "${String(
      params.documentId ?? params.id ?? 'document'
    )}"`;
  },

  createSummary: (input: unknown) => {
    const params = getParams(input);

    return `✍️ Creating summary for: "${String(
      params.topic ?? params.content ?? 'content'
    )}"`;
  },

  CreateSummary: (input: unknown) => {
    const params = getParams(input);

    return `✍️ Creating summary for: "${String(
      params.topic ?? params.content ?? 'content'
    )}"`;
  },

  getStudyTips: (input: unknown) => {
    const params = getParams(input);

    return `Finding study tips for: "${String(
      params.subject ?? params.topic ?? 'topic'
    )}"`;
  },

  GetStudyTips: (input: unknown) => {
    const params = getParams(input);

    return `Finding study tips for: "${String(
      params.subject ?? params.topic ?? 'topic'
    )}"`;
  },
};

export function ToolCallView({ part }: ToolCallViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toolName = getToolName(part);

  const description =
    TOOL_DESCRIPTIONS[toolName]?.(part.input) ?? `Using tool: ${toolName}`;

  const isCompleted =
    part.state === 'result' ||
    part.state === 'output-available' ||
    part.state?.includes('output') ||
    part.state?.includes('result');

  const status = isCompleted ? 'Completed' : 'Running';

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="group flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 transition-all duration-200 hover:bg-indigo-100"
        title="Click to see tool details"
      >
        <SparklesIcon className="h-4 w-4 text-indigo-600 transition-transform group-hover:scale-110" />

        <span className="text-xs font-medium text-indigo-700">
          {isExpanded ? '▼ Tool Details' : '▶ Tool Used'}
        </span>
      </button>

      {isExpanded && (
        <div className="ml-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm font-medium text-slate-700">
            {description}
          </p>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                status === 'Completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {status === 'Running' && (
                <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-current" />
              )}

              {status}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-1 text-xs text-slate-500">
            <span className="font-mono">{toolName}</span>
          </div>
        </div>
      )}
    </div>
  );
}