import { getUpcomingClassroomQuizzes } from '@/features/quizzes/server/quizzes.service';

export const runtime = 'nodejs';

type ClassroomUpcomingQuizzesRouteContext = {
  params: {
    classroomId: string;
  };
};

export async function GET(
  _request: Request,
  { params }: ClassroomUpcomingQuizzesRouteContext,
) {
  try {
    return Response.json(await getUpcomingClassroomQuizzes(params.classroomId));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 400 },
    );
  }
}
