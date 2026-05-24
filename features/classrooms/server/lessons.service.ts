import {
  createLessonRecord,
  deleteLessonRecord,
  getLessonById,
  getLessonsByClassroomId,
  getLessonWithClassroom,
  reorderLessonRecords,
  updateLessonRecord,
} from '@/features/classrooms/repositories/lessons.repository';
import {
  createLessonSchema,
  reorderLessonsSchema,
  updateLessonSchema,
} from '@/features/classrooms/schemas';
import type {
  CreateLessonInput,
  ReorderLessonsInput,
  UpdateLessonInput,
} from '@/features/classrooms/types';
import { requireCurrentUserRole } from '@/features/auth/server/roles.service';
import {
  assertCurrentUserCanViewClassroom,
  assertProfessorOwnsClassroom,
} from '@/features/classrooms/server/classrooms.service';

export async function createLesson(input: CreateLessonInput) {
  const { userId } = await requireCurrentUserRole('professor');
  const values = createLessonSchema.parse(input);

  await assertProfessorOwnsClassroom(values.classroomId, userId);

  return createLessonRecord(values);
}

export async function getLessonsByClassroom(classroomId: string) {
  await assertCurrentUserCanViewClassroom(classroomId);
  return getLessonsByClassroomId(classroomId);
}

export async function updateLesson(lessonId: string, input: UpdateLessonInput) {
  const { userId } = await requireCurrentUserRole('professor');
  const lessonWithClassroom = await getLessonWithClassroom(lessonId);

  if (!lessonWithClassroom) {
    throw new Error('Lesson not found');
  }

  await assertProfessorOwnsClassroom(
    lessonWithClassroom.lesson.classroomId,
    userId,
  );

  const values = updateLessonSchema.parse(input);
  const lesson = await updateLessonRecord(
    lessonId,
    lessonWithClassroom.lesson.classroomId,
    values,
  );

  if (!lesson) {
    throw new Error('Lesson not found');
  }

  return lesson;
}

export async function deleteLesson(lessonId: string) {
  const { userId } = await requireCurrentUserRole('professor');
  const lessonWithClassroom = await getLessonWithClassroom(lessonId);

  if (!lessonWithClassroom) {
    throw new Error('Lesson not found');
  }

  await assertProfessorOwnsClassroom(
    lessonWithClassroom.lesson.classroomId,
    userId,
  );

  const lesson = await deleteLessonRecord(
    lessonId,
    lessonWithClassroom.lesson.classroomId,
  );

  if (!lesson) {
    throw new Error('Lesson not found');
  }

  return lesson;
}

export async function reorderLessons(input: ReorderLessonsInput) {
  const { userId } = await requireCurrentUserRole('professor');
  const values = reorderLessonsSchema.parse(input);

  await assertProfessorOwnsClassroom(values.classroomId, userId);

  const currentLessons = await getLessonsByClassroomId(values.classroomId);
  const currentLessonIds = new Set(currentLessons.map(lesson => lesson.id));

  if (currentLessonIds.size !== values.lessonIds.length) {
    throw new Error('Lesson order does not match classroom lessons');
  }

  for (const lessonId of values.lessonIds) {
    if (!currentLessonIds.has(lessonId)) {
      throw new Error('Lesson order does not match classroom lessons');
    }
  }

  return reorderLessonRecords(values.classroomId, values.lessonIds);
}

export async function getLessonForAccessCheck(lessonId: string) {
  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    throw new Error('Lesson not found');
  }

  await assertCurrentUserCanViewClassroom(lesson.classroomId);
  return lesson;
}
