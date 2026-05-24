'use server';

import {
  createLesson,
  deleteLesson,
  getLessonsByClassroom,
  reorderLessons,
  updateLesson,
} from '@/features/classrooms/server/lessons.service';
import type {
  CreateLessonInput,
  ReorderLessonsInput,
  UpdateLessonInput,
} from '@/features/classrooms/types';

const toActionError = (error: unknown) =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : 'Something went wrong';

export async function createLessonAction(input: CreateLessonInput) {
  try {
    return await createLesson(input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function getLessonsByClassroomAction(classroomId: string) {
  try {
    return await getLessonsByClassroom(classroomId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateLessonAction(
  lessonId: string,
  input: UpdateLessonInput,
) {
  try {
    return await updateLesson(lessonId, input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteLessonAction(lessonId: string) {
  try {
    return await deleteLesson(lessonId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function reorderLessonsAction(input: ReorderLessonsInput) {
  try {
    return await reorderLessons(input);
  } catch (error) {
    return toActionError(error);
  }
}
