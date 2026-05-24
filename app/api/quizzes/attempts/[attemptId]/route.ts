import { getMyQuizResult } from '@/features/quizzes/server/quiz-attempts.service';

export const runtime = 'nodejs';

type AttemptRouteContext = {
  params: {
    attemptId: string;
  };
};

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function GET(_request: Request, { params }: AttemptRouteContext) {
  try {
    return Response.json(await getMyQuizResult(params.attemptId));
  } catch (error) {
    return toErrorResponse(error);
  }
}
