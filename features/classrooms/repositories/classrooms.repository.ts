import { and, asc, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  classroomMaterials,
  classroomMemberships,
  classrooms,
} from '@/lib/db/schema/classrooms';
import { quizzes } from '@/lib/db/schema/quizzes';

const classroomSelect = {
  id: classrooms.id,
  professorId: classrooms.professorId,
  icon: classrooms.icon,
  color: classrooms.color,
  title: classrooms.title,
  description: classrooms.description,
  createdAt: classrooms.createdAt,
  updatedAt: classrooms.updatedAt,
};

const classroomStatsSelect = {
  numberOfStudents: sql<number>`cast(count(distinct ${classroomMemberships.id}) as int)`,
  materialCount: sql<number>`cast(count(distinct ${classroomMaterials.id}) as int)`,
  quizCount: sql<number>`cast(count(distinct ${quizzes.id}) as int)`,
};

export async function createClassroomRecord(input: typeof classrooms.$inferInsert) {
  const [classroom] = await db.insert(classrooms).values(input).returning();
  return classroom;
}

export async function getClassroomRecordById(classroomId: string) {
  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.id, classroomId))
    .limit(1);

  return classroom;
}

export async function getClassroomWithStudentCount(classroomId: string) {
  const [classroom] = await db
    .select({
      ...classroomSelect,
      ...classroomStatsSelect,
    })
    .from(classrooms)
    .leftJoin(
      classroomMemberships,
      eq(classroomMemberships.classroomId, classrooms.id),
    )
    .leftJoin(
      classroomMaterials,
      eq(classroomMaterials.classroomId, classrooms.id),
    )
    .leftJoin(quizzes, eq(quizzes.classroomId, classrooms.id))
    .where(eq(classrooms.id, classroomId))
    .groupBy(
      classrooms.id,
      classrooms.professorId,
      classrooms.icon,
      classrooms.color,
      classrooms.title,
      classrooms.description,
      classrooms.createdAt,
      classrooms.updatedAt,
    )
    .limit(1);

  return classroom;
}

export async function getClassroomsByProfessor(professorId: string) {
  return db
    .select({
      ...classroomSelect,
      ...classroomStatsSelect,
    })
    .from(classrooms)
    .leftJoin(
      classroomMemberships,
      eq(classroomMemberships.classroomId, classrooms.id),
    )
    .leftJoin(
      classroomMaterials,
      eq(classroomMaterials.classroomId, classrooms.id),
    )
    .leftJoin(quizzes, eq(quizzes.classroomId, classrooms.id))
    .where(eq(classrooms.professorId, professorId))
    .groupBy(
      classrooms.id,
      classrooms.professorId,
      classrooms.icon,
      classrooms.color,
      classrooms.title,
      classrooms.description,
      classrooms.createdAt,
      classrooms.updatedAt,
    )
    .orderBy(desc(classrooms.createdAt));
}

export async function getClassroomsByStudent(studentId: string) {
  return db
    .select({
      ...classroomSelect,
      ...classroomStatsSelect,
    })
    .from(classrooms)
    .innerJoin(
      classroomMemberships,
      eq(classroomMemberships.classroomId, classrooms.id),
    )
    .leftJoin(
      classroomMaterials,
      eq(classroomMaterials.classroomId, classrooms.id),
    )
    .leftJoin(quizzes, eq(quizzes.classroomId, classrooms.id))
    .where(eq(classroomMemberships.studentId, studentId))
    .groupBy(
      classrooms.id,
      classrooms.professorId,
      classrooms.icon,
      classrooms.color,
      classrooms.title,
      classrooms.description,
      classrooms.createdAt,
      classrooms.updatedAt,
    )
    .orderBy(asc(classrooms.title));
}

export async function updateClassroomRecord(
  classroomId: string,
  professorId: string,
  input: Partial<typeof classrooms.$inferInsert>,
) {
  const [classroom] = await db
    .update(classrooms)
    .set({ ...input, updatedAt: new Date() })
    .where(
      and(
        eq(classrooms.id, classroomId),
        eq(classrooms.professorId, professorId),
      ),
    )
    .returning();

  return classroom;
}

export async function deleteClassroomRecord(
  classroomId: string,
  professorId: string,
) {
  const [classroom] = await db
    .delete(classrooms)
    .where(
      and(
        eq(classrooms.id, classroomId),
        eq(classrooms.professorId, professorId),
      ),
    )
    .returning();

  return classroom;
}

export async function addClassroomMembership(
  classroomId: string,
  studentId: string,
) {
  const [membership] = await db
    .insert(classroomMemberships)
    .values({ classroomId, studentId })
    .onConflictDoNothing()
    .returning();

  return membership;
}

export async function removeClassroomMembership(
  classroomId: string,
  studentId: string,
) {
  const [membership] = await db
    .delete(classroomMemberships)
    .where(
      and(
        eq(classroomMemberships.classroomId, classroomId),
        eq(classroomMemberships.studentId, studentId),
      ),
    )
    .returning();

  return membership;
}

export async function getClassroomMemberships(classroomId: string) {
  return db
    .select()
    .from(classroomMemberships)
    .where(eq(classroomMemberships.classroomId, classroomId))
    .orderBy(asc(classroomMemberships.createdAt));
}

export async function isStudentEnrolledInClassroom(
  classroomId: string,
  studentId: string,
) {
  const [membership] = await db
    .select({ id: classroomMemberships.id })
    .from(classroomMemberships)
    .where(
      and(
        eq(classroomMemberships.classroomId, classroomId),
        eq(classroomMemberships.studentId, studentId),
      ),
    )
    .limit(1);

  return Boolean(membership);
}
