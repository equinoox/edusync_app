'use client';

import { SparklesIcon } from '@heroicons/react/24/outline';

import type { AiStudyInsightProps } from '@/features/progress/types';

export function AiStudyInsight({ weakestTopic }: AiStudyInsightProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-violet-500/20 bg-violet-950/70 p-4 shadow-[0_18px_45px_rgba(76,29,149,0.24)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/35 text-violet-100">
          <SparklesIcon className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-white">AI Study Insight</h2>
          <p className="mt-1 text-sm text-slate-300">
            You&apos;re making great progress! Keep focusing on{' '}
            {weakestTopic ?? 'your recent quizzes'} to improve your understanding
            of key concepts.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500"
      >
        <SparklesIcon className="h-5 w-5" />
        Get AI Study Tips
      </button>
    </section>
  );
}
