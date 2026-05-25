import { z } from 'zod';

export const progressSourceTypes = ['classroom', 'general'] as const;
export const progressActivityTypes = [
  'quiz_completed',
  'score_improvement',
  'achievement',
] as const;

export const progressOverviewSchema = z.object({
  totalQuizzesCompleted: z.number().int().nonnegative(),
  averageScore: z.number().nonnegative(),
  averageAccuracy: z.number().nonnegative(),
  averageSpeedScore: z.number().nonnegative(),
  totalWeightedScore: z.number(),
  bestTopic: z.string().nullable(),
  weakestTopic: z.string().nullable(),
});

export const progressQuizPerformanceSchema = z.object({
  quizId: z.string(),
  quizTitle: z.string(),
  classroomId: z.string().nullable(),
  classroomTitle: z.string().nullable(),
  sourceType: z.enum(progressSourceTypes),
  topicName: z.string(),
  score: z.number(),
  maxScore: z.number(),
  scorePercent: z.number(),
  accuracyPercent: z.number(),
  speedScore: z.number(),
  weight: z.number(),
  weightedScore: z.number(),
  timeSpentSeconds: z.number().int().nonnegative(),
  timeLimitSeconds: z.number().int().nonnegative(),
  submittedAt: z.string(),
});

export const progressTopicSchema = z.object({
  topicName: z.string(),
  sourceType: z.enum(progressSourceTypes),
  quizzesCompleted: z.number().int().nonnegative(),
  averageScore: z.number().nonnegative(),
  averageAccuracy: z.number().nonnegative(),
  averageSpeedScore: z.number().nonnegative(),
  weightedScore: z.number(),
});

export const progressActivitySchema = z.object({
  id: z.string(),
  type: z.enum(progressActivityTypes),
  title: z.string(),
  description: z.string(),
  occurredAt: z.string(),
  quizId: z.string().optional(),
  topicName: z.string().optional(),
  scorePercent: z.number().optional(),
});

export const fakeStudyTimeStatsSchema = z.object({
  totalStudySeconds: z.number().int().nonnegative(),
  totalStudyTimeLabel: z.string(),
  changeFromLastPeriodSeconds: z.number().int(),
  changeLabel: z.string(),
  byTopic: z.array(
    z.object({
      topicName: z.string(),
      studySeconds: z.number().int().nonnegative(),
      studyTimeLabel: z.string(),
      percent: z.number().nonnegative(),
    }),
  ),
  overTime: z.array(
    z.object({
      date: z.string(),
      studySeconds: z.number().int().nonnegative(),
    }),
  ),
});
