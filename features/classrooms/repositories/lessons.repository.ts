import { and, asc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { classrooms, lessons } from '@/lib/db/schema/classrooms';

export async function createLessonRecord(input: typeof lessons.$inferInsert) {
  const [lesson] = await db.insert(lessons).values(input).returning();
  return lesson;
}

export async function getLessonById(lessonId: string) {
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  return lesson;
}

export async function getLessonWithClassroom(lessonId: string) {
  const [lesson] = await db
    .select({
      lesson: lessons,
      classroom: classrooms,
    })
    .from(lessons)
    .innerJoin(classrooms, eq(classrooms.id, lessons.classroomId))
    .where(eq(lessons.id, lessonId))
    .limit(1);

  return lesson;
}

export async function getLessonsByClassroomId(classroomId: string) {
  return db
    .select()
    .from(lessons)
    .where(eq(lessons.classroomId, classroomId))
    .orderBy(asc(lessons.sequenceNumber));
}

export async function getFirstLessonByClassroomId(classroomId: string) {
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.classroomId, classroomId))
    .orderBy(asc(lessons.sequenceNumber))
    .limit(1);

  return lesson;
}

export async function updateLessonRecord(
  lessonId: string,
  classroomId: string,
  input: Partial<typeof lessons.$inferInsert>,
) {
  const [lesson] = await db
    .update(lessons)
    .set({ ...input, updatedAt: new Date() })
    .where(
      and(
        eq(lessons.id, lessonId),
        eq(lessons.classroomId, classroomId),
      ),
    )
    .returning();

  return lesson;
}

export async function deleteLessonRecord(lessonId: string, classroomId: string) {
  const [lesson] = await db
    .delete(lessons)
    .where(
      and(
        eq(lessons.id, lessonId),
        eq(lessons.classroomId, classroomId),
      ),
    )
    .returning();

  return lesson;
}

export async function updateLessonSequence(
  lessonId: string,
  classroomId: string,
  sequenceNumber: number,
) {
  const [lesson] = await db
    .update(lessons)
    .set({ sequenceNumber, updatedAt: new Date() })
    .where(
      and(
        eq(lessons.id, lessonId),
        eq(lessons.classroomId, classroomId),
      ),
    )
    .returning();

  return lesson;
}

export async function reorderLessonRecords(
  classroomId: string,
  lessonIds: string[],
) {
  return db.transaction(async tx => {
    for (const [index, lessonId] of lessonIds.entries()) {
      await tx
        .update(lessons)
        .set({ sequenceNumber: -1 * (index + 1), updatedAt: new Date() })
        .where(
          and(
            eq(lessons.id, lessonId),
            eq(lessons.classroomId, classroomId),
          ),
        );
    }

    const reorderedLessons = [];

    for (const [index, lessonId] of lessonIds.entries()) {
      const [lesson] = await tx
        .update(lessons)
        .set({ sequenceNumber: index + 1, updatedAt: new Date() })
        .where(
          and(
            eq(lessons.id, lessonId),
            eq(lessons.classroomId, classroomId),
          ),
        )
        .returning();

      reorderedLessons.push(lesson);
    }

    return reorderedLessons;
  });
}
