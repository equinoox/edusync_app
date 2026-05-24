import {
  deleteQuiz,
  getQuizForEditing,
  getQuizForTaking,
  updateQuiz,
} from '@/features/quizzes/server/quizzes.service';
import { getCurrentUserWithRole } from '@/features/auth/server/roles.service';

export const runtime = 'nodejs';

type QuizRouteContext = {
  params: {
    quizId: string;
  };
};

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function GET(_request: Request, { params }: QuizRouteContext) {
  try {
    const currentUser = await getCurrentUserWithRole();
    const quiz =
      currentUser.role === 'professor'
        ? await getQuizForEditing(params.quizId)
        : await getQuizForTaking(params.quizId);

    return Response.json(quiz);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: QuizRouteContext) {
  try {
    return Response.json(await updateQuiz(params.quizId, await request.json()));
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: QuizRouteContext) {
  try {
    return Response.json(await deleteQuiz(params.quizId));
  } catch (error) {
    return toErrorResponse(error);
  }
}
