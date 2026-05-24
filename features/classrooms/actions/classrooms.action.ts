'use server';

import {
  addStudentToClassroom,
  createClassroom,
  deleteClassroom,
  getClassroomById,
  removeStudentFromClassroom,
  updateClassroom,
} from '@/features/classrooms/server/classrooms.service';
import type {
  AddStudentToClassroomInput,
  CreateClassroomInput,
  RemoveStudentFromClassroomInput,
  UpdateClassroomInput,
} from '@/features/classrooms/types';

const toActionError = (error: unknown) =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : 'Something went wrong';

export async function createClassroomAction(input: CreateClassroomInput) {
  try {
    return await createClassroom(input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function getClassroomByIdAction(classroomId: string) {
  try {
    return await getClassroomById(classroomId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateClassroomAction(
  classroomId: string,
  input: UpdateClassroomInput,
) {
  try {
    return await updateClassroom(classroomId, input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteClassroomAction(classroomId: string) {
  try {
    return await deleteClassroom(classroomId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function addStudentToClassroomAction(
  input: AddStudentToClassroomInput,
) {
  try {
    return await addStudentToClassroom(input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function removeStudentFromClassroomAction(
  input: RemoveStudentFromClassroomInput,
) {
  try {
    return await removeStudentFromClassroom(input);
  } catch (error) {
    return toActionError(error);
  }
}
