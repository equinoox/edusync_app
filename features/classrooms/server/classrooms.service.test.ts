import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { classrooms } from '@/lib/db/schema/classrooms';
import {
  addStudentToClassroom,
  createClassroom,
} from '@/features/classrooms/server/classrooms.service';
import {
  getClassroomMemberships,
  getClassroomRecordById,
  isStudentEnrolledInClassroom,
} from '@/features/classrooms/repositories/classrooms.repository';

// @clerk/nextjs/server oslanja se na Next.js request kontekst (čita HTTP
// zaglavlja), pa se u testu koji se pokreće izvan Next.js servera zamenjuje
// kontrolisanom lažnom implementacijom: currentUser objekat određuje koji
// je korisnik trenutno "prijavljen" i koju ulogu ima.
const currentUser = vi.hoisted(() => ({
  userId: 'test-professor-vitest',
  role: 'professor' as 'professor' | 'student',
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(async () => ({ userId: currentUser.userId })),
  clerkClient: vi.fn(async () => ({
    users: {
      getUser: vi.fn(async () => ({
        publicMetadata: { role: currentUser.role },
      })),
    },
  })),
}));

describe('createClassroom', () => {
  const createdClassroomIds: string[] = [];

  afterEach(async () => {
    for (const id of createdClassroomIds.splice(0)) {
      await db.delete(classrooms).where(eq(classrooms.id, id));
    }
  });

  it('kreira učionicu čiji je vlasnik prijavljeni profesor', async () => {
    currentUser.role = 'professor';

    const classroom = await createClassroom({
      icon: 'book',
      color: 'blue',
      title: 'Test - Baze podataka',
      description: 'Učionica kreirana iz automatizovanog testa.',
    });

    createdClassroomIds.push(classroom!.id);

    expect(classroom).toMatchObject({
      professorId: currentUser.userId,
      title: 'Test - Baze podataka',
      numberOfStudents: 0,
    });

    const stored = await getClassroomRecordById(classroom!.id);
    expect(stored?.professorId).toBe(currentUser.userId);
  });

  it('odbija kreiranje učionice bez naziva', async () => {
    currentUser.role = 'professor';

    await expect(
      createClassroom({
        icon: 'book',
        color: 'blue',
        title: '',
        description: 'Nedostaje naziv učionice.',
      }),
    ).rejects.toThrow();
  });
});

describe('addStudentToClassroom', () => {
  const studentId = 'test-student-vitest';
  let classroomId: string;

  beforeEach(async () => {
    currentUser.role = 'professor';

    const classroom = await createClassroom({
      icon: 'book',
      color: 'green',
      title: 'Test - Upis studenta',
      description: 'Pomoćna učionica za test upisa studenta.',
    });
    classroomId = classroom!.id;
  });

  afterEach(async () => {
    await db.delete(classrooms).where(eq(classrooms.id, classroomId));
  });

  it('upisuje studenta u učionicu', async () => {
    currentUser.role = 'professor';

    const membership = await addStudentToClassroom({ classroomId, studentId });

    expect(membership).toMatchObject({ classroomId, studentId });
    expect(await isStudentEnrolledInClassroom(classroomId, studentId)).toBe(
      true,
    );
  });

  it('ne upisuje istog studenta dva puta u istu učionicu', async () => {
    currentUser.role = 'professor';

    await addStudentToClassroom({ classroomId, studentId });
    const secondAttempt = await addStudentToClassroom({
      classroomId,
      studentId,
    });

    // onConflictDoNothing() ne vraća red pri drugom pokušaju upisa
    expect(secondAttempt).toBeUndefined();

    const memberships = await getClassroomMemberships(classroomId);
    const matches = memberships.filter(
      membership => membership.studentId === studentId,
    );
    expect(matches).toHaveLength(1);
  });
});
