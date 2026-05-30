import {
  createClassroomMaterialRecord,
  deleteClassroomMaterialRecord,
  getClassroomMaterialsByClassroomId,
  getClassroomMaterialWithClassroom,
} from '@/features/classrooms/repositories/classroom-materials.repository';
import {
  addClassroomMaterialSchema,
  copyClassroomMaterialToUserDocumentsSchema,
} from '@/features/classrooms/schemas';
import type {
  AddClassroomMaterialInput,
  CopyClassroomMaterialInput,
} from '@/features/classrooms/types';
import { requireCurrentUserRole } from '@/features/auth/server/roles.service';
import {
  assertCurrentUserCanViewClassroom,
  assertProfessorOwnsClassroom,
  checkStudentAccessToClassroom,
} from '@/features/classrooms/server/classrooms.service';
import { copyDocumentFromUrlForUser } from '@/features/documents/server/documents.service';
import { createNotificationsForClassroomStudents } from '@/features/notifications/server/notifications.service';
import { parseSchemaOrThrow } from '@/lib/validation/zod';

export async function addClassroomMaterial(input: AddClassroomMaterialInput) {
  const { userId } = await requireCurrentUserRole('professor');
  const values = parseSchemaOrThrow(addClassroomMaterialSchema, input);

  const classroom = await assertProfessorOwnsClassroom(values.classroomId, userId);
  const material = await createClassroomMaterialRecord(values);

  await createNotificationsForClassroomStudents({
    classroomId: classroom.id,
    type: 'classroom_document_added',
    title: 'New classroom document',
    message: `A new document was added to ${classroom.title}.`,
    link: '/classrooms',
    relatedClassroomId: classroom.id,
    relatedMaterialId: material.id,
  });

  return material;
}

export async function getClassroomMaterials(classroomId: string) {
  await assertCurrentUserCanViewClassroom(classroomId);
  return getClassroomMaterialsByClassroomId(classroomId);
}

export async function deleteClassroomMaterial(materialId: string) {
  const { userId } = await requireCurrentUserRole('professor');
  const materialWithClassroom = await getClassroomMaterialWithClassroom(materialId);

  if (!materialWithClassroom) {
    throw new Error('Classroom material not found');
  }

  await assertProfessorOwnsClassroom(
    materialWithClassroom.material.classroomId,
    userId,
  );

  const material = await deleteClassroomMaterialRecord(
    materialId,
    materialWithClassroom.material.classroomId,
  );

  if (!material) {
    throw new Error('Classroom material not found');
  }

  return material;
}

export async function copyClassroomMaterialToMyDocuments(
  input: CopyClassroomMaterialInput,
) {
  const { userId } = await requireCurrentUserRole('student');
  const values = parseSchemaOrThrow(copyClassroomMaterialToUserDocumentsSchema, input);
  const materialWithClassroom = await getClassroomMaterialWithClassroom(
    values.materialId,
  );

  if (!materialWithClassroom) {
    throw new Error('Classroom material not found');
  }

  const hasAccess = await checkStudentAccessToClassroom(
    materialWithClassroom.material.classroomId,
    userId,
  );

  if (!hasAccess) {
    throw new Error('Forbidden');
  }

  return copyDocumentFromUrlForUser({
    userId,
    fileName: materialWithClassroom.material.fileName,
    fileUrl: materialWithClassroom.material.fileUrl,
    mimeType: materialWithClassroom.material.mimeType,
    storageKey: materialWithClassroom.material.storageKey,
  });
}
