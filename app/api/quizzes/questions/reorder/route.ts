import { reorderQuestions } from '@/features/quizzes/server/quizzes.service';

export const runtime = 'nodejs';

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function POST(request: Request) {
  try {
    return Response.json(await reorderQuestions(await request.json()));
  } catch (error) {
    return toErrorResponse(error);
  }
}
