import { addQuestionToQuiz } from '@/features/quizzes/server/quizzes.service';

export const runtime = 'nodejs';

type QuizQuestionsRouteContext = {
  params: {
    quizId: string;
  };
};

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function POST(
  request: Request,
  { params }: QuizQuestionsRouteContext,
) {
  try {
    return Response.json(
      await addQuestionToQuiz({
        ...(await request.json()),
        quizId: params.quizId,
      }),
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
