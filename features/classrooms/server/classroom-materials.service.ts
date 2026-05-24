import {
  createLessonMaterialRecord,
  deleteLessonMaterialRecord,
  getLessonMaterialsByLessonId,
  getLessonMaterialWithLessonAndClassroom,
} from '@/features/classrooms/repositories/classroom-materials.repository';
import {
  addLessonMaterialSchema,
  copyLessonMaterialToUserDocumentsSchema,
} from '@/features/classrooms/schemas';
import type {
  AddLessonMaterialInput,
  CopyLessonMaterialInput,
} from '@/features/classrooms/types';
import { requireCurrentUserRole } from '@/features/auth/server/roles.service';
import {
  assertCurrentUserCanViewClassroom,
  assertProfessorOwnsClassroom,
  checkStudentAccessToClassroom,
} from '@/features/classrooms/server/classrooms.service';
import {
  createLessonRecord,
  getFirstLessonByClassroomId,
  getLessonById,
} from '@/features/classrooms/repositories/lessons.repository';
import { copyDocumentFromUrlForUser } from '@/features/documents/server/documents.service';

export async function addLessonMaterial(input: AddLessonMaterialInput) {
  const { userId } = await requireCurrentUserRole('professor');
  const values = addLessonMaterialSchema.parse(input);
  const lesson = await getLessonById(values.lessonId);

  if (!lesson) {
    throw new Error('Lesson not found');
  }

  await assertProfessorOwnsClassroom(lesson.classroomId, userId);

  return createLessonMaterialRecord(values);
}

async function getOrCreateClassroomMaterialsLesson(classroomId: string) {
  const existingLesson = await getFirstLessonByClassroomId(classroomId);

  if (existingLesson) {
    return existingLesson;
  }

  return createLessonRecord({
    classroomId,
    sequenceNumber: 1,
    title: 'Classroom Materials',
  });
}

export async function addClassroomMaterial(input: Omit<AddLessonMaterialInput, 'lessonId'> & {
  classroomId: string;
}) {
  const { userId } = await requireCurrentUserRole('professor');

  await assertProfessorOwnsClassroom(input.classroomId, userId);

  const lesson = await getOrCreateClassroomMaterialsLesson(input.classroomId);
  const values = addLessonMaterialSchema.parse({
    ...input,
    lessonId: lesson.id,
  });

  return createLessonMaterialRecord(values);
}

export async function getLessonMaterials(lessonId: string) {
  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    throw new Error('Lesson not found');
  }

  await assertCurrentUserCanViewClassroom(lesson.classroomId);
  return getLessonMaterialsByLessonId(lessonId);
}

export async function deleteLessonMaterial(materialId: string) {
  const { userId } = await requireCurrentUserRole('professor');
  const materialWithLesson = await getLessonMaterialWithLessonAndClassroom(materialId);

  if (!materialWithLesson) {
    throw new Error('Lesson material not found');
  }

  await assertProfessorOwnsClassroom(
    materialWithLesson.lesson.classroomId,
    userId,
  );

  const material = await deleteLessonMaterialRecord(
    materialId,
    materialWithLesson.lesson.id,
  );

  if (!material) {
    throw new Error('Lesson material not found');
  }

  return material;
}

export async function copyLessonMaterialToMyDocuments(
  input: CopyLessonMaterialInput,
) {
  const { userId } = await requireCurrentUserRole('student');
  const values = copyLessonMaterialToUserDocumentsSchema.parse(input);
  const materialWithLesson = await getLessonMaterialWithLessonAndClassroom(
    values.materialId,
  );

  if (!materialWithLesson) {
    throw new Error('Lesson material not found');
  }

  const hasAccess = await checkStudentAccessToClassroom(
    materialWithLesson.lesson.classroomId,
    userId,
  );

  if (!hasAccess) {
    throw new Error('Forbidden');
  }

  return copyDocumentFromUrlForUser({
    userId,
    fileName: materialWithLesson.material.fileName,
    fileUrl: materialWithLesson.material.fileUrl,
    mimeType: materialWithLesson.material.mimeType,
    storageKey: materialWithLesson.material.storageKey,
  });
}
