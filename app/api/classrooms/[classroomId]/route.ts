import { getClassroomDetails } from '@/features/classrooms/server/classrooms.service';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: { classroomId: string } },
) {
  try {
    return Response.json(await getClassroomDetails(params.classroomId));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 400 },
    );
  }
}
