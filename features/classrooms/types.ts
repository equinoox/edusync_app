import type { z } from 'zod';

import type {
  addClassroomMaterialSchema,
  addStudentToClassroomSchema,
  copyClassroomMaterialToUserDocumentsSchema,
  createClassroomSchema,
  removeStudentFromClassroomSchema,
  updateClassroomSchema,
} from '@/features/classrooms/schemas';

export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;
export type UpdateClassroomInput = z.infer<typeof updateClassroomSchema>;
export type AddStudentToClassroomInput = z.infer<typeof addStudentToClassroomSchema>;
export type RemoveStudentFromClassroomInput = z.infer<typeof removeStudentFromClassroomSchema>;
export type AddClassroomMaterialInput = z.infer<typeof addClassroomMaterialSchema>;
export type CopyClassroomMaterialInput = z.infer<typeof copyClassroomMaterialToUserDocumentsSchema>;

export type ClassroomListItem = {
  id: string;
  professorId: string;
  icon: string;
  color: string;
  title: string;
  description: string;
  numberOfStudents: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type ClassroomStudent = {
  id: string;
  classroomId: string;
  studentId: string;
  createdAt: Date | string;
  profile?: {
    id: string;
    fullName: string | null;
    email: string | null;
    imageUrl: string | null;
  } | null;
};

export type ClassroomMaterial = {
  id: string;
  classroomId: string;
  title: string;
  fileName: string;
  fileUrl: string;
  storageKey: string | null;
  mimeType: string;
  size: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type ClassroomDetails = {
  classroom: ClassroomListItem;
  students: ClassroomStudent[];
  materials: ClassroomMaterial[];
  viewerRole: 'student' | 'professor';
  canManage: boolean;
};
