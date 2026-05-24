import { getClassroomQuizzes } from '@/features/quizzes/server/quizzes.service';

export const runtime = 'nodejs';

type ClassroomQuizzesRouteContext = {
  params: {
    classroomId: string;
  };
};

export async function GET(
  _request: Request,
  { params }: ClassroomQuizzesRouteContext,
) {
  try {
    return Response.json(await getClassroomQuizzes(params.classroomId));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 400 },
    );
  }
}
