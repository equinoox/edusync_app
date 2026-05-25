'use server';

import {
  getFakeStudyTimeStats,
  getMyProgressOverview,
  getMyQuizPerformance,
  getMyRecentProgressActivity,
  getMyTopicProgress,
} from '@/features/progress/server/progress.service';

const toActionError = (error: unknown) =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : 'Something went wrong';

export async function getMyProgressOverviewAction() {
  try {
    return await getMyProgressOverview();
  } catch (error) {
    return toActionError(error);
  }
}

export async function getMyQuizPerformanceAction() {
  try {
    return await getMyQuizPerformance();
  } catch (error) {
    return toActionError(error);
  }
}

export async function getMyTopicProgressAction() {
  try {
    return await getMyTopicProgress();
  } catch (error) {
    return toActionError(error);
  }
}

export async function getMyRecentProgressActivityAction() {
  try {
    return await getMyRecentProgressActivity();
  } catch (error) {
    return toActionError(error);
  }
}

export async function getFakeStudyTimeStatsAction() {
  try {
    return await getFakeStudyTimeStats();
  } catch (error) {
    return toActionError(error);
  }
}
