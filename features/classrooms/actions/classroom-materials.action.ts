'use server';

import {
  addClassroomMaterial,
  copyClassroomMaterialToMyDocuments,
  deleteClassroomMaterial,
  getClassroomMaterials,
} from '@/features/classrooms/server/classroom-materials.service';
import { put } from '@vercel/blob';
import { classroomMaterialFileNameSchema } from '@/features/classrooms/schemas';
import type { CopyClassroomMaterialInput } from '@/features/classrooms/types';

const toActionError = (error: unknown) =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : 'Something went wrong';

export async function addClassroomMaterialAction(formData: FormData) {
  try {
    const classroomId = formData.get('classroomId');
    const file = formData.get('file');

    if (typeof classroomId !== 'string' || classroomId.length === 0) {
      throw new Error('Classroom id is required');
    }

    if (!(file instanceof File)) {
      throw new Error('PDF file is required');
    }

    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are supported');
    }

    classroomMaterialFileNameSchema.parse(file.name);

    const blob = await put(`classrooms/${classroomId}/${file.name}`, file, {
      access: 'public',
    });

    return await addClassroomMaterial({
      classroomId,
      title: file.name.replace(/\.pdf$/i, ''),
      fileName: file.name,
      fileUrl: blob.url,
      storageKey: blob.pathname,
      mimeType: 'application/pdf',
      size: file.size,
    });
  } catch (error) {
    return toActionError(error);
  }
}

export async function getClassroomMaterialsAction(classroomId: string) {
  try {
    return await getClassroomMaterials(classroomId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteClassroomMaterialAction(materialId: string) {
  try {
    return await deleteClassroomMaterial(materialId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function copyClassroomMaterialToMyDocumentsAction(
  input: CopyClassroomMaterialInput,
) {
  try {
    return await copyClassroomMaterialToMyDocuments(input);
  } catch (error) {
    return toActionError(error);
  }
}
