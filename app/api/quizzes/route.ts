import {
  createQuiz,
  getAvailableQuizzes,
} from '@/features/quizzes/server/quizzes.service';

export const runtime = 'nodejs';

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function GET() {
  try {
    return Response.json(await getAvailableQuizzes());
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    return Response.json(await createQuiz(await request.json()));
  } catch (error) {
    return toErrorResponse(error);
  }
}
