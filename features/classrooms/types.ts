import type { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentType, SVGProps } from 'react';

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
  materialCount: number;
  quizCount: number;
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

export type ClassroomSortOrder = 'desc' | 'asc';
export type ClassroomViewerRole = 'student' | 'professor';
export type ClassroomToastTone = 'success' | 'error' | 'info';
export type ClassroomToastStatusCode = number | string;
export type ClassroomIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type ClassroomsDashboardHeaderProps = {
  isProfessor: boolean;
  search: string;
  sortOrder: ClassroomSortOrder;
  role: ClassroomViewerRole | null;
  onSearchChange: (value: string) => void;
  onSortOrderChange: (value: ClassroomSortOrder) => void;
  onCreateClassroom: () => void;
};

export type UpcomingPanelProps = {
  classroomId?: string;
  viewerRole?: ClassroomViewerRole;
  onError?: (message: string) => void;
};

export type ClassroomDetailsModalProps = {
  classroom: ClassroomListItem | null;
  onClose: () => void;
  onToast: (message: string, tone?: ClassroomToastTone, statusCode?: ClassroomToastStatusCode) => void;
  onChanged: () => void;
};

export type ClassroomStudentsManagerProps = {
  classroomId: string;
  canManage: boolean;
  students: ClassroomStudent[];
  onChanged: () => void;
  onToast: (message: string, tone?: ClassroomToastTone, statusCode?: ClassroomToastStatusCode) => void;
};

export type ClassroomStudentPendingAction =
  | { type: 'add'; studentId: string }
  | { type: 'remove'; studentId: string };

export type ClassroomMaterialsManagerProps = {
  classroomId: string;
  canManage: boolean;
  isStudent: boolean;
  materials: ClassroomMaterial[];
  onChanged: () => void;
  onToast: (message: string, tone?: ClassroomToastTone, statusCode?: ClassroomToastStatusCode) => void;
};

export type ClassroomMaterialPendingAction =
  | { type: 'add'; file: File }
  | { type: 'delete'; material: ClassroomMaterial };

export type ClassroomCardProps = {
  classroom: ClassroomListItem;
  actions?: ReactNode;
  onView: (classroom: ClassroomListItem) => void;
  animationDelayMs?: number;
};

export type ClassroomActionsMenuProps = {
  canDelete: boolean;
  classroomTitle: string;
  onDelete: () => void;
};

export type ClassroomStatCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string | number;
  tone: 'violet' | 'orange' | 'green' | 'blue';
};

export type CreateClassroomButtonProps = {
  onClick: () => void;
  compact?: boolean;
  className?: string;
};

export type CreateClassroomModalProps = {
  isOpen: boolean;
  isSaving: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (input: CreateClassroomInput) => void;
};

export type CopyClassroomMaterialButtonProps = {
  isLoading: boolean;
  onCopy: () => void;
};
