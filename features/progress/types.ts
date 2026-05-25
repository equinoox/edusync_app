import type { z } from 'zod';
import type { ComponentType, SVGProps } from 'react';

import type {
  fakeStudyTimeStatsSchema,
  progressActivitySchema,
  progressActivityTypes,
  progressOverviewSchema,
  progressQuizPerformanceSchema,
  progressSourceTypes,
  progressTopicSchema,
} from '@/features/progress/schemas';

export type ProgressSourceType = (typeof progressSourceTypes)[number];
export type ProgressActivityType = (typeof progressActivityTypes)[number];

export type ProgressOverview = z.infer<typeof progressOverviewSchema>;
export type ProgressQuizPerformance = z.infer<
  typeof progressQuizPerformanceSchema
>;
export type ProgressTopic = z.infer<typeof progressTopicSchema>;
export type ProgressActivity = z.infer<typeof progressActivitySchema>;
export type FakeStudyTimeStats = z.infer<typeof fakeStudyTimeStatsSchema>;

export type ProgressApiResponse = {
  overview: ProgressOverview;
  quizPerformance: ProgressQuizPerformance[];
  topicProgress: ProgressTopic[];
  recentActivity: ProgressActivity[];
  studyTimeStats: FakeStudyTimeStats;
};

export type ProgressIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type ProgressMetricTone = 'violet' | 'green' | 'blue' | 'orange';

export type ProgressMetricCardProps = {
  label: string;
  value: string;
  changeLabel: string;
  progress: number;
  tone: ProgressMetricTone;
  Icon: ProgressIcon;
};

export type ProgressHeaderProps = {
  classroomLabel: string;
  periodLabel: string;
};

export type ProgressLineChartPoint = {
  label: string;
  overallProgress: number;
  quizAverage: number;
  studyTimePercent: number;
  studyTimeLabel: string;
};

export type ProgressLineChartProps = {
  points: ProgressLineChartPoint[];
};

export type SubjectPerformanceItem = {
  id: string;
  name: string;
  percent: number;
  tone: ProgressMetricTone | 'cyan' | 'pink';
  Icon: ProgressIcon;
};

export type SubjectPerformanceProps = {
  items: SubjectPerformanceItem[];
  onViewAll?: () => void;
};

export type DonutSegment = {
  label: string;
  value: number;
  detail: string;
  color: string;
};

export type DonutPanelProps = {
  title: string;
  centerValue: string;
  centerLabel: string;
  segments: DonutSegment[];
  footerLabel: string;
  onViewAll?: () => void;
};

export type RecentAchievementsProps = {
  activities: ProgressActivity[];
  onViewAll?: () => void;
};

export type AiStudyInsightProps = {
  weakestTopic: string | null;
};
