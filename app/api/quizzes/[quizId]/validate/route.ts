import { validateQuizForPublishing } from '@/features/quizzes/server/quizzes.service';

export const runtime = 'nodejs';

type QuizValidateRouteContext = {
  params: {
    quizId: string;
  };
};

export async function POST(
  _request: Request,
  { params }: QuizValidateRouteContext,
) {
  try {
    return Response.json(await validateQuizForPublishing(params.quizId));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 400 },
    );
  }
}
