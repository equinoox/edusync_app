import type { z } from 'zod';

import type {
  addLessonMaterialSchema,
  addStudentToClassroomSchema,
  copyLessonMaterialToUserDocumentsSchema,
  createClassroomSchema,
  createLessonSchema,
  removeStudentFromClassroomSchema,
  reorderLessonsSchema,
  updateClassroomSchema,
  updateLessonSchema,
} from '@/features/classrooms/schemas';

export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;
export type UpdateClassroomInput = z.infer<typeof updateClassroomSchema>;
export type AddStudentToClassroomInput = z.infer<typeof addStudentToClassroomSchema>;
export type RemoveStudentFromClassroomInput = z.infer<typeof removeStudentFromClassroomSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type ReorderLessonsInput = z.infer<typeof reorderLessonsSchema>;
export type AddLessonMaterialInput = z.infer<typeof addLessonMaterialSchema>;
export type CopyLessonMaterialInput = z.infer<typeof copyLessonMaterialToUserDocumentsSchema>;

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
};

export type ClassroomMaterial = {
  id: string;
  lessonId: string;
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
