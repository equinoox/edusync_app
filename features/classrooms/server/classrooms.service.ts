import {
  addClassroomMembership,
  createClassroomRecord,
  deleteClassroomRecord,
  getClassroomRecordById,
  getClassroomsByProfessor,
  getClassroomsByStudent,
  getClassroomMemberships,
  getClassroomWithStudentCount,
  isStudentEnrolledInClassroom,
  removeClassroomMembership,
  updateClassroomRecord,
} from '@/features/classrooms/repositories/classrooms.repository';
import { getClassroomMaterialsByClassroomId } from '@/features/classrooms/repositories/classroom-materials.repository';
import {
  addStudentToClassroomSchema,
  createClassroomSchema,
  removeStudentFromClassroomSchema,
  updateClassroomSchema,
} from '@/features/classrooms/schemas';
import type {
  AddStudentToClassroomInput,
  ClassroomDetails,
  CreateClassroomInput,
  RemoveStudentFromClassroomInput,
  UpdateClassroomInput,
} from '@/features/classrooms/types';
import {
  getCurrentUserWithRole,
  requireCurrentUserRole,
} from '@/features/auth/server/roles.service';
import { getUsersByIds } from '@/features/auth/server/users.service';
import { notifyStudentAddedToClassroom } from '@/features/notifications/server/notifications.service';

export async function createClassroom(input: CreateClassroomInput) {
  const { userId } = await requireCurrentUserRole('professor');
  const values = createClassroomSchema.parse(input);

  const classroom = await createClassroomRecord({
    ...values,
    professorId: userId,
  });

  return getClassroomWithStudentCount(classroom.id);
}

export async function getProfessorClassrooms() {
  const { userId } = await requireCurrentUserRole('professor');
  return getClassroomsByProfessor(userId);
}

export async function getStudentClassrooms() {
  const { userId } = await requireCurrentUserRole('student');
  return getClassroomsByStudent(userId);
}

export async function assertProfessorOwnsClassroom(
  classroomId: string,
  professorId: string,
) {
  const classroom = await getClassroomRecordById(classroomId);

  if (!classroom) {
    throw new Error('Classroom not found');
  }

  if (classroom.professorId !== professorId) {
    throw new Error('Forbidden');
  }

  return classroom;
}

export async function checkStudentAccessToClassroom(
  classroomId: string,
  studentId?: string,
) {
  const currentUser = studentId
    ? { userId: studentId, role: 'student' as const }
    : await requireCurrentUserRole('student');

  return isStudentEnrolledInClassroom(classroomId, currentUser.userId);
}

export async function assertCurrentUserCanViewClassroom(classroomId: string) {
  const currentUser = await getCurrentUserWithRole();
  const classroom = await getClassroomRecordById(classroomId);

  if (!classroom) {
    throw new Error('Classroom not found');
  }

  if (currentUser.role === 'professor') {
    if (classroom.professorId !== currentUser.userId) {
      throw new Error('Forbidden');
    }

    return classroom;
  }

  const hasAccess = await isStudentEnrolledInClassroom(
    classroomId,
    currentUser.userId,
  );

  if (!hasAccess) {
    throw new Error('Forbidden');
  }

  return classroom;
}

export async function getClassroomById(classroomId: string) {
  await assertCurrentUserCanViewClassroom(classroomId);
  const classroom = await getClassroomWithStudentCount(classroomId);

  if (!classroom) {
    throw new Error('Classroom not found');
  }

  return classroom;
}

export async function getClassroomDetails(
  classroomId: string,
): Promise<ClassroomDetails> {
  const currentUser = await getCurrentUserWithRole();
  const classroom = await getClassroomRecordById(classroomId);

  if (!classroom) {
    throw new Error('Classroom not found');
  }

  const canManage =
    currentUser.role === 'professor' &&
    classroom.professorId === currentUser.userId;

  if (!canManage) {
    if (currentUser.role !== 'student') {
      throw new Error('Forbidden');
    }

    const hasAccess = await isStudentEnrolledInClassroom(
      classroomId,
      currentUser.userId,
    );

    if (!hasAccess) {
      throw new Error('Forbidden');
    }
  }

  const classroomWithCount = await getClassroomWithStudentCount(classroomId);

  if (!classroomWithCount) {
    throw new Error('Classroom not found');
  }

  const [students, materials] = await Promise.all([
    getClassroomMemberships(classroomId),
    getClassroomMaterialsByClassroomId(classroomId),
  ]);
  const studentProfiles = await getUsersByIds(
    students.map(student => student.studentId),
  );

  return {
    classroom: classroomWithCount,
    students: students.map(student => ({
      ...student,
      profile: studentProfiles.get(student.studentId) ?? null,
    })),
    materials,
    viewerRole: currentUser.role,
    canManage,
  };
}

export async function updateClassroom(
  classroomId: string,
  input: UpdateClassroomInput,
) {
  const { userId } = await requireCurrentUserRole('professor');
  await assertProfessorOwnsClassroom(classroomId, userId);
  const values = updateClassroomSchema.parse(input);

  const classroom = await updateClassroomRecord(classroomId, userId, values);

  if (!classroom) {
    throw new Error('Classroom not found');
  }

  return classroom;
}

export async function deleteClassroom(classroomId: string) {
  const { userId } = await requireCurrentUserRole('professor');
  await assertProfessorOwnsClassroom(classroomId, userId);

  const classroom = await deleteClassroomRecord(classroomId, userId);

  if (!classroom) {
    throw new Error('Classroom not found');
  }

  return classroom;
}

export async function addStudentToClassroom(input: AddStudentToClassroomInput) {
  const currentUser = await getCurrentUserWithRole();
  const values = addStudentToClassroomSchema.parse(input);

  const classroom = await getClassroomRecordById(values.classroomId);
  if (!classroom) {
    throw new Error('Classroom not found');
  }

  if (currentUser.role === 'professor') {
    await assertProfessorOwnsClassroom(values.classroomId, currentUser.userId);

    if (!values.studentId) {
      throw new Error('Student id is required');
    }

    const membership = await addClassroomMembership(
      values.classroomId,
      values.studentId,
    );

    if (membership) {
      await notifyStudentAddedToClassroom({
        studentId: values.studentId,
        classroomId: values.classroomId,
      });
    }

    return membership;
  }

  return addClassroomMembership(values.classroomId, currentUser.userId);
}

export async function removeStudentFromClassroom(
  input: RemoveStudentFromClassroomInput,
) {
  const currentUser = await getCurrentUserWithRole();
  const values = removeStudentFromClassroomSchema.parse(input);

  if (currentUser.role === 'professor') {
    await assertProfessorOwnsClassroom(values.classroomId, currentUser.userId);

    if (!values.studentId) {
      throw new Error('Student id is required');
    }

    return removeClassroomMembership(values.classroomId, values.studentId);
  }

  return removeClassroomMembership(values.classroomId, currentUser.userId);
}
