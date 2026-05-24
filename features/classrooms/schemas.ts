import { z } from 'zod';

import {
  classroomColorValues,
  classroomIconValues,
} from '@/features/classrooms/options';

export const createClassroomSchema = z.object({
  icon: z.enum(classroomIconValues),
  color: z.enum(classroomColorValues),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
});

export const updateClassroomSchema = createClassroomSchema.partial();

export const addStudentToClassroomSchema = z.object({
  classroomId: z.string().min(1),
  studentId: z.string().min(1).optional(),
});

export const removeStudentFromClassroomSchema = z.object({
  classroomId: z.string().min(1),
  studentId: z.string().min(1).optional(),
});

export const addClassroomMaterialSchema = z.object({
  classroomId: z.string().min(1),
  title: z.string().min(1).max(255),
  fileName: z.string().min(1).max(255),
  fileUrl: z.string().url(),
  storageKey: z.string().min(1).optional(),
  mimeType: z.literal('application/pdf'),
  size: z.number().int().positive(),
});

export const copyClassroomMaterialToUserDocumentsSchema = z.object({
  materialId: z.string().min(1),
});

export const classroomMaterialFileNameSchema = z
  .string()
  .regex(
    /^\d+_[A-Za-z0-9-]+_[A-Za-z0-9-]+\.pdf$/i,
    'Document name must use this format: 01_Math_Algebra.pdf',
  );
