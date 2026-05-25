'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import {
  AcademicCapIcon,
  BeakerIcon,
  BellIcon,
  BookOpenIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';

import Sidebar from '@/components/layout/sidebar';
import SmallBar from '@/components/layout/SmallBar';
import { AiStudyInsight } from '@/features/progress/components/AiStudyInsight';
import { DonutPanel } from '@/features/progress/components/DonutPanel';
import { ProgressHeader } from '@/features/progress/components/ProgressHeader';
import { ProgressLineChart } from '@/features/progress/components/ProgressLineChart';
import { ProgressMetricCard } from '@/features/progress/components/ProgressMetricCard';
import { RecentAchievements } from '@/features/progress/components/RecentAchievements';
import { SubjectPerformance } from '@/features/progress/components/SubjectPerformance';
import type {
  DonutSegment,
  FakeStudyTimeStats,
  ProgressApiResponse,
  ProgressLineChartPoint,
  ProgressQuizPerformance,
  ProgressTopic,
  SubjectPerformanceItem,
} from '@/features/progress/types';
import { cn } from '@/lib/utils';

type DocumentListItem = {
  id: string;
  createdAt: string | Date;
};

const dayMs = 24 * 60 * 60 * 1000;

const formatPercent = (value: number) => `${Math.round(value)}%`;

const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));

const formatStudyPoints = (seconds: number) => `${Math.round(seconds / 60)}p`;

const getDateAgeInDays = (value: string | Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(value);
  date.setHours(0, 0, 0, 0);

  return Math.floor((today.getTime() - date.getTime()) / dayMs);
};

const isInDayRange = (
  value: string | Date,
  minAgeInDays: number,
  maxAgeInDays: number,
) => {
  const age = getDateAgeInDays(value);
  return age >= minAgeInDays && age <= maxAgeInDays;
};

const average = (values: number[]) =>
  values.length > 0
    ? values.reduce((total, value) => total + value, 0) / values.length
    : 0;

const formatSignedPercent = (value: number) =>
  `${value >= 0 ? '+' : '-'}${Math.abs(Math.round(value))}%`;

const formatSignedCount = (value: number) =>
  `${value >= 0 ? '+' : '-'}${Math.abs(value)}`;

const getAverageChangeLabel = (
  performance: ProgressQuizPerformance[],
  metric: 'scorePercent' | 'accuracyPercent',
) => {
  const currentValues = performance
    .filter(item => isInDayRange(item.submittedAt, 0, 6))
    .map(item => item[metric]);
  const previousValues = performance
    .filter(item => isInDayRange(item.submittedAt, 7, 13))
    .map(item => item[metric]);
  const change = average(currentValues) - average(previousValues);

  return `${formatSignedPercent(change)} from previous 7 days`;
};

const getDocumentChangeLabel = (documents: DocumentListItem[]) => {
  const currentCount = documents.filter(document =>
    isInDayRange(document.createdAt, 0, 6),
  ).length;
  const previousCount = documents.filter(document =>
    isInDayRange(document.createdAt, 7, 13),
  ).length;

  return `${formatSignedCount(currentCount - previousCount)} from previous 7 days`;
};

const getCurrentStudySeconds = (stats: FakeStudyTimeStats) =>
  stats.overTime
    .slice(-7)
    .reduce((total, item) => total + item.studySeconds, 0);

const getScoreBucketSegments = (
  performance: ProgressQuizPerformance[],
): DonutSegment[] => {
  const total = performance.length;
  const excellent = performance.filter(item => item.scorePercent >= 90).length;
  const good = performance.filter(
    item => item.scorePercent >= 70 && item.scorePercent < 90,
  ).length;
  const average = performance.filter(
    item => item.scorePercent >= 50 && item.scorePercent < 70,
  ).length;
  const needsWork = performance.filter(item => item.scorePercent < 50).length;

  return [
    {
      label: 'Excellent (90-100%)',
      value: total > 0 ? Math.round((excellent / total) * 100) : 0,
      detail: `${excellent} quizzes`,
      color: '#4ade80',
    },
    {
      label: 'Good (70-89%)',
      value: total > 0 ? Math.round((good / total) * 100) : 0,
      detail: `${good} quizzes`,
      color: '#60a5fa',
    },
    {
      label: 'Average (50-69%)',
      value: total > 0 ? Math.round((average / total) * 100) : 0,
      detail: `${average} quizzes`,
      color: '#fb923c',
    },
    {
      label: 'Needs Improvement (<50%)',
      value: total > 0 ? Math.round((needsWork / total) * 100) : 0,
      detail: `${needsWork} quizzes`,
      color: '#ec4899',
    },
  ];
};

const getStudySegments = (stats: FakeStudyTimeStats): DonutSegment[] =>
  stats.byTopic.map((item, index) => ({
    label: item.topicName,
    value: Math.round(item.percent),
    detail: item.studyTimeLabel,
    color: ['#7c3aed', '#fb923c', '#38bdf8', '#94a3b8'][index] ?? '#94a3b8',
  }));

const getSubjectIcon = (index: number) =>
  [AcademicCapIcon, BeakerIcon, BookOpenIcon, CodeBracketIcon, ChartBarIcon, GlobeAltIcon][
    index % 6
  ];

const getSubjectTone = (index: number): SubjectPerformanceItem['tone'] =>
  ['violet', 'orange', 'green', 'cyan', 'pink', 'blue'][index % 6] as SubjectPerformanceItem['tone'];

const toSubjectItems = (topics: ProgressTopic[]): SubjectPerformanceItem[] => {
  return topics.slice(0, 6).map((topic, index) => ({
    id: `${topic.sourceType}-${topic.topicName}`,
    name: topic.topicName,
    percent: Math.round(topic.averageScore),
    tone: getSubjectTone(index),
    Icon: getSubjectIcon(index),
  }));
};

const toLineChartPoints = (
  performance: ProgressQuizPerformance[],
  stats: FakeStudyTimeStats,
): ProgressLineChartPoint[] => {
  const sorted = [...performance].sort(
    (first, second) =>
      new Date(first.submittedAt).getTime() -
      new Date(second.submittedAt).getTime(),
  );

  const maxStudySeconds = Math.max(
    1,
    ...stats.overTime.map(item => item.studySeconds),
  );

  return stats.overTime.map(studyPoint => {
    const endOfDay = new Date(`${studyPoint.date}T23:59:59.999Z`).getTime();
    const visibleItems = sorted.filter(
      item => new Date(item.submittedAt).getTime() <= endOfDay,
    );

    return {
      label: formatShortDate(studyPoint.date),
      overallProgress: average(visibleItems.map(item => item.scorePercent)),
      quizAverage: average(visibleItems.map(item => item.accuracyPercent)),
      studyTimePercent: (studyPoint.studySeconds / maxStudySeconds) * 100,
      studyTimeLabel: formatStudyPoints(studyPoint.studySeconds),
    };
  });
};

export function ProgressPage() {
  const { isLoaded, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<ProgressApiResponse | null>(null);
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = user?.publicMetadata?.role;

  const loadProgress = useCallback(async () => {
    if (!isLoaded || !role) return;

    if (role !== 'student') {
      setError('Progress is available for students only.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [progressResponse, documentsResponse] = await Promise.all([
        fetch('/api/progress'),
        fetch('/api/documents'),
      ]);
      const progressData = await progressResponse.json();
      const documentsData = await documentsResponse.json();

      if (!progressResponse.ok) {
        throw new Error(progressData.error ?? 'Unable to load progress');
      }

      if (!documentsResponse.ok) {
        throw new Error(documentsData.error ?? 'Unable to load documents');
      }

      setData(progressData as ProgressApiResponse);
      setDocuments(documentsData as DocumentListItem[]);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Unable to load progress',
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, role]);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  const subjectItems = useMemo(
    () => toSubjectItems(data?.topicProgress ?? []),
    [data?.topicProgress],
  );
  const lineChartPoints = useMemo(
    () =>
      data
        ? toLineChartPoints(data.quizPerformance, data.studyTimeStats)
        : [],
    [data],
  );
  const quizSegments = useMemo(
    () => getScoreBucketSegments(data?.quizPerformance ?? []),
    [data?.quizPerformance],
  );
  const studySegments = useMemo(
    () => (data ? getStudySegments(data.studyTimeStats) : []),
    [data],
  );

  const averageScore = data?.overview.averageScore ?? 0;
  const averageAccuracy = data?.overview.averageAccuracy ?? 0;
  const totalStudyPoints = data?.studyTimeStats.totalStudyTimeLabel ?? '0p';
  const documentCount = documents.length;
  const currentStudySeconds = data ? getCurrentStudySeconds(data.studyTimeStats) : 0;
  const weeklyStudyGoalSeconds = 10 * 3600;

  return (
    <main className="flex h-screen overflow-hidden bg-[#060d1d] text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar sidebarOpen={sidebarOpen} />
      </div>

      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <SmallBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="hidden h-20 shrink-0 items-center justify-end gap-5 px-8 lg:flex">
          <button
            type="button"
            className="relative rounded-xl p-2 text-slate-300 transition hover:bg-slate-900"
            aria-label="Notifications"
            title="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-violet-500" />
          </button>
          <div className="rounded-xl bg-slate-900/75 px-3 py-2">
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: 'flex-row-reverse gap-3',
                  userButtonOuterIdentifier: 'text-white text-sm font-semibold',
                  avatarBox: 'h-9 w-9',
                },
              }}
              showName
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5 sm:px-5 lg:px-6">
          <div className="mx-auto max-w-[1560px] rounded-2xl border border-white/[0.04] bg-slate-950/70 p-4 shadow-[0_26px_70px_rgba(0,0,0,0.28)] sm:p-5">
            <ProgressHeader
              classroomLabel="All Classrooms"
              periodLabel="This Semester"
            />

            {isLoading ? (
              <div className="mt-8 grid min-h-[560px] place-items-center rounded-2xl bg-slate-900/60">
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
              </div>
            ) : error ? (
              <div className="mt-8 rounded-2xl border border-violet-500/20 bg-slate-900/70 p-10 text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-violet-300" />
                <h2 className="mt-4 text-xl font-semibold text-white">
                  Progress unavailable
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
                  {error}
                </p>
              </div>
            ) : data ? (
              <>
                <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.5fr]">
                  <ProgressMetricCard
                    Icon={ChartBarIcon}
                    label="Overall Progress"
                    value={formatPercent(averageScore)}
                    changeLabel={getAverageChangeLabel(data.quizPerformance, 'scorePercent')}
                    progress={averageScore}
                    tone="violet"
                  />
                  <ProgressMetricCard
                    Icon={CheckCircleIcon}
                    label="Quizzes Average"
                    value={formatPercent(averageAccuracy)}
                    changeLabel={getAverageChangeLabel(data.quizPerformance, 'accuracyPercent')}
                    progress={averageAccuracy}
                    tone="green"
                  />
                  <ProgressMetricCard
                    Icon={DocumentTextIcon}
                    label="Documents Uploaded"
                    value={String(documentCount)}
                    changeLabel={getDocumentChangeLabel(documents)}
                    progress={Math.min(
                      100,
                      documents.filter(document =>
                        isInDayRange(document.createdAt, 0, 6),
                      ).length * 20,
                    )}
                    tone="blue"
                  />
                  <ProgressMetricCard
                    Icon={CircleStackIcon}
                    label="Study Points"
                    value={totalStudyPoints}
                    changeLabel={data.studyTimeStats.changeLabel}
                    progress={Math.min(
                      100,
                      (currentStudySeconds / weeklyStudyGoalSeconds) * 100,
                    )}
                    tone="orange"
                  />
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                  <ProgressLineChart points={lineChartPoints} />
                  <SubjectPerformance items={subjectItems} />
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(320px,1fr)]">
                  <DonutPanel
                    title="Quiz Performance"
                    centerValue={formatPercent(averageScore)}
                    centerLabel="Average Score"
                    segments={quizSegments}
                    footerLabel="View all quizzes"
                  />
                  <DonutPanel
                    title="Study Points Breakdown"
                    centerValue={totalStudyPoints}
                    centerLabel="Total"
                    segments={studySegments}
                    footerLabel="View detailed breakdown"
                  />
                  <RecentAchievements activities={data.recentActivity} />
                </div>

                <div className="mt-5">
                  <AiStudyInsight weakestTopic={data.overview.weakestTopic} />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
