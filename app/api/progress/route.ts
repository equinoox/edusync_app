import {
  getFakeStudyTimeStats,
  getMyProgressOverview,
  getMyQuizPerformance,
  getMyRecentProgressActivity,
  getMyTopicProgress,
} from '@/features/progress/server/progress.service';

export const runtime = 'nodejs';

const toErrorResponse = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Something went wrong';
  const status =
    message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 400;

  return Response.json({ error: message }, { status });
};

export async function GET() {
  try {
    const [
      overview,
      quizPerformance,
      topicProgress,
      recentActivity,
      studyTimeStats,
    ] = await Promise.all([
      getMyProgressOverview(),
      getMyQuizPerformance(),
      getMyTopicProgress(),
      getMyRecentProgressActivity(),
      getFakeStudyTimeStats(),
    ]);

    return Response.json({
      overview,
      quizPerformance,
      topicProgress,
      recentActivity,
      studyTimeStats,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
