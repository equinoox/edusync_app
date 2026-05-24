import {
  getProfessorClassrooms,
  getStudentClassrooms,
} from '@/features/classrooms/server/classrooms.service';
import { getCurrentUserWithRole } from '@/features/auth/server/roles.service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const currentUser = await getCurrentUserWithRole();
    const classrooms =
      currentUser.role === 'professor'
        ? await getProfessorClassrooms()
        : await getStudentClassrooms();

    return Response.json({
      role: currentUser.role,
      classrooms,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 400 },
    );
  }
}
