import { requireCurrentUserRole } from '@/features/auth/server/roles.service';
import { getSubmittedProgressAttemptsByStudent } from '@/features/progress/repositories/progress.repository';
import type {
  FakeStudyTimeStats,
  ProgressActivity,
  ProgressOverview,
  ProgressQuizPerformance,
  ProgressSourceType,
  ProgressTopic,
} from '@/features/progress/types';

const round = (value: number, precision = 2) =>
  Number(value.toFixed(precision));

const average = (values: number[]) =>
  values.length > 0
    ? round(values.reduce((total, value) => total + value, 0) / values.length)
    : 0;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toIsoString = (value: Date | string | null) =>
  value ? new Date(value).toISOString() : new Date(0).toISOString();

const formatStudyPoints = (seconds: number) => `${Math.round(seconds / 60)}p`;

const getDateKey = (value: Date | string) =>
  new Date(value).toISOString().slice(0, 10);

const getDayRange = (days: number) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (days - 1 - index));
    return date.toISOString().slice(0, 10);
  });
};

function getSpeedScore(timeLimitSeconds: number, timeSpentSeconds: number) {
  if (timeLimitSeconds <= 0) {
    return 0;
  }

  return round(
    clamp(
      ((timeLimitSeconds - timeSpentSeconds) / timeLimitSeconds) * 100,
      0,
      100,
    ),
  );
}

function toQuizPerformance(
  record: Awaited<
    ReturnType<typeof getSubmittedProgressAttemptsByStudent>
  >[number],
): ProgressQuizPerformance {
  const sourceType: ProgressSourceType = record.classroomId
    ? 'classroom'
    : 'general';
  const timeLimitSeconds = record.timeLimitMinutes * 60;
  const timeSpentSeconds = record.timeSpentSeconds ?? timeLimitSeconds;
  const maxScore = Number(record.maxScore);
  const score = Number(record.score);
  const scorePercent =
    maxScore > 0 ? round(clamp((score / maxScore) * 100, 0, 100)) : 0;
  const weight = Number(record.weight);

  return {
    quizId: record.quizId,
    quizTitle: record.quizTitle,
    classroomId: record.classroomId,
    classroomTitle: record.classroomTitle,
    sourceType,
    topicName:
      sourceType === 'classroom'
        ? record.classroomTitle ?? record.quizTitle
        : record.quizTitle,
    score,
    maxScore,
    scorePercent,
    accuracyPercent: round(Number(record.accuracyPercent)),
    speedScore: getSpeedScore(timeLimitSeconds, timeSpentSeconds),
    weight,
    weightedScore: round(scorePercent * weight),
    timeSpentSeconds,
    timeLimitSeconds,
    submittedAt: toIsoString(record.submittedAt),
  };
}

async function getMyProgressRows() {
  const { userId } = await requireCurrentUserRole('student');
  const records = await getSubmittedProgressAttemptsByStudent(userId);

  return records.map(toQuizPerformance);
}

function getTopicProgressFromPerformance(
  performance: ProgressQuizPerformance[],
): ProgressTopic[] {
  const topicMap = new Map<
    string,
    {
      topicName: string;
      sourceType: ProgressSourceType;
      scorePercentages: number[];
      accuracies: number[];
      speedScores: number[];
      weightedScore: number;
    }
  >();

  for (const item of performance) {
    const key = `${item.sourceType}:${item.topicName}`;
    const current = topicMap.get(key) ?? {
      topicName: item.topicName,
      sourceType: item.sourceType,
      scorePercentages: [],
      accuracies: [],
      speedScores: [],
      weightedScore: 0,
    };

    current.scorePercentages.push(item.scorePercent);
    current.accuracies.push(item.accuracyPercent);
    current.speedScores.push(item.speedScore);
    current.weightedScore += item.weightedScore;
    topicMap.set(key, current);
  }

  return Array.from(topicMap.values())
    .map(topic => ({
      topicName: topic.topicName,
      sourceType: topic.sourceType,
      quizzesCompleted: topic.scorePercentages.length,
      averageScore: average(topic.scorePercentages),
      averageAccuracy: average(topic.accuracies),
      averageSpeedScore: average(topic.speedScores),
      weightedScore: round(topic.weightedScore),
    }))
    .sort((first, second) => second.averageScore - first.averageScore);
}

export async function getMyQuizPerformance(): Promise<
  ProgressQuizPerformance[]
> {
  return getMyProgressRows();
}

export async function getMyTopicProgress(): Promise<ProgressTopic[]> {
  return getTopicProgressFromPerformance(await getMyProgressRows());
}

export async function getMyProgressOverview(): Promise<ProgressOverview> {
  const performance = await getMyProgressRows();
  const topics = getTopicProgressFromPerformance(performance);
  const weakestTopic = [...topics].sort(
    (first, second) => first.averageScore - second.averageScore,
  )[0];

  return {
    totalQuizzesCompleted: performance.length,
    averageScore: average(performance.map(item => item.scorePercent)),
    averageAccuracy: average(performance.map(item => item.accuracyPercent)),
    averageSpeedScore: average(performance.map(item => item.speedScore)),
    totalWeightedScore: round(
      performance.reduce((total, item) => total + item.weightedScore, 0),
    ),
    bestTopic: topics[0]?.topicName ?? null,
    weakestTopic: weakestTopic?.topicName ?? null,
  };
}

export async function getMyRecentProgressActivity(): Promise<
  ProgressActivity[]
> {
  const performance = await getMyProgressRows();
  const chronological = [...performance].sort(
    (first, second) =>
      new Date(first.submittedAt).getTime() -
      new Date(second.submittedAt).getTime(),
  );
  const activities: ProgressActivity[] = [];

  for (const item of performance.slice(0, 8)) {
    activities.push({
      id: `quiz-completed-${item.quizId}`,
      type: 'quiz_completed',
      title: 'Quiz completed',
      description: `${item.quizTitle} completed with ${item.scorePercent}%`,
      occurredAt: item.submittedAt,
      quizId: item.quizId,
      topicName: item.topicName,
      scorePercent: item.scorePercent,
    });
  }

  chronological.forEach((item, index) => {
    const previous = chronological[index - 1];

    if (!previous || item.scorePercent < previous.scorePercent + 5) {
      return;
    }

    activities.push({
      id: `score-improvement-${item.quizId}`,
      type: 'score_improvement',
      title: 'Score improved',
      description: `Improved by ${round(
        item.scorePercent - previous.scorePercent,
      )}% compared with the previous quiz`,
      occurredAt: item.submittedAt,
      quizId: item.quizId,
      topicName: item.topicName,
      scorePercent: item.scorePercent,
    });
  });

  for (const item of performance.slice(0, 8)) {
    if (item.scorePercent >= 90) {
      activities.push({
        id: `achievement-high-score-${item.quizId}`,
        type: 'achievement',
        title: 'Quiz Master',
        description: `Scored ${item.scorePercent}% on ${item.quizTitle}`,
        occurredAt: item.submittedAt,
        quizId: item.quizId,
        topicName: item.topicName,
        scorePercent: item.scorePercent,
      });
    }

    if (item.speedScore >= 85) {
      activities.push({
        id: `achievement-fast-finish-${item.quizId}`,
        type: 'achievement',
        title: 'Fast Finisher',
        description: `Finished ${item.quizTitle} with a ${item.speedScore}% speed score`,
        occurredAt: item.submittedAt,
        quizId: item.quizId,
        topicName: item.topicName,
        scorePercent: item.scorePercent,
      });
    }
  }

  return activities
    .sort(
      (first, second) =>
        new Date(second.occurredAt).getTime() -
        new Date(first.occurredAt).getTime(),
    )
    .slice(0, 12);
}

function getEstimatedStudySeconds(item: ProgressQuizPerformance) {
  const reviewSeconds = Math.min(30 * 60, Math.round(item.timeLimitSeconds * 0.25));
  const difficultySeconds = Math.round(Math.max(1, item.weight) * 60);

  return item.timeSpentSeconds + reviewSeconds + difficultySeconds;
}

function buildStudyTimeStats(
  performance: ProgressQuizPerformance[],
): FakeStudyTimeStats {
  const dayKeys = getDayRange(14);
  const dailySeconds = new Map(dayKeys.map(day => [day, 0]));
  const topicSeconds = new Map<string, number>();

  for (const item of performance) {
    const estimatedSeconds = getEstimatedStudySeconds(item);
    const dayKey = getDateKey(item.submittedAt);

    if (dailySeconds.has(dayKey)) {
      dailySeconds.set(dayKey, (dailySeconds.get(dayKey) ?? 0) + estimatedSeconds);
    }

    topicSeconds.set(
      item.topicName,
      (topicSeconds.get(item.topicName) ?? 0) + estimatedSeconds,
    );
  }

  const byTopic = Array.from(topicSeconds.entries())
    .map(([topicName, studySeconds]) => ({ topicName, studySeconds }))
    .sort((first, second) => second.studySeconds - first.studySeconds);
  const totalStudySeconds = byTopic.reduce(
    (total, item) => total + item.studySeconds,
    0,
  );
  const currentPeriodSeconds = dayKeys
    .slice(-7)
    .reduce((total, day) => total + (dailySeconds.get(day) ?? 0), 0);
  const previousPeriodSeconds = dayKeys
    .slice(0, 7)
    .reduce((total, day) => total + (dailySeconds.get(day) ?? 0), 0);
  const changeFromLastPeriodSeconds =
    currentPeriodSeconds - previousPeriodSeconds;
  const changePrefix = changeFromLastPeriodSeconds >= 0 ? '+' : '-';

  return {
    totalStudySeconds,
    totalStudyTimeLabel: formatStudyPoints(totalStudySeconds),
    changeFromLastPeriodSeconds,
    changeLabel: `${changePrefix}${formatStudyPoints(
      Math.abs(changeFromLastPeriodSeconds),
    )} from previous 7 days`,
    byTopic: byTopic.map(item => ({
      ...item,
      studyTimeLabel: formatStudyPoints(item.studySeconds),
      percent:
        totalStudySeconds > 0
          ? round((item.studySeconds / totalStudySeconds) * 100)
          : 0,
    })),
    overTime: dayKeys.map(date => ({
      date,
      studySeconds: dailySeconds.get(date) ?? 0,
    })),
  };
}

export async function getFakeStudyTimeStats(): Promise<FakeStudyTimeStats> {
  const { userId } = await requireCurrentUserRole('student');
  const records = await getSubmittedProgressAttemptsByStudent(userId);

  return buildStudyTimeStats(records.map(toQuizPerformance));
}
