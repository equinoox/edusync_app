import { submitQuizAttempt } from '@/features/quizzes/server/quiz-attempts.service';

export const runtime = 'nodejs';

type SubmitAttemptRouteContext = {
  params: {
    attemptId: string;
  };
};

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function POST(
  request: Request,
  { params }: SubmitAttemptRouteContext,
) {
  try {
    return Response.json(
      await submitQuizAttempt({
        ...(await request.json()),
        attemptId: params.attemptId,
      }),
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
