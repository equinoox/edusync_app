import { getUpcomingQuizzes } from '@/features/quizzes/server/quizzes.service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    return Response.json(await getUpcomingQuizzes());
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 400 },
    );
  }
}
