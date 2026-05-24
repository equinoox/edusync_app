import {
  getMyQuizAttempts,
  startQuizAttempt,
} from '@/features/quizzes/server/quiz-attempts.service';

export const runtime = 'nodejs';

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function GET() {
  try {
    return Response.json(await getMyQuizAttempts());
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    return Response.json(await startQuizAttempt(await request.json()));
  } catch (error) {
    return toErrorResponse(error);
  }
}
