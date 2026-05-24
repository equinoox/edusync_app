import {
  deleteQuestion,
  updateQuestion,
} from '@/features/quizzes/server/quizzes.service';

export const runtime = 'nodejs';

type QuestionRouteContext = {
  params: {
    questionId: string;
  };
};

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function PATCH(request: Request, { params }: QuestionRouteContext) {
  try {
    return Response.json(
      await updateQuestion(params.questionId, await request.json()),
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: QuestionRouteContext,
) {
  try {
    return Response.json(await deleteQuestion(params.questionId));
  } catch (error) {
    return toErrorResponse(error);
  }
}
