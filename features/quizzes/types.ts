import type { z } from 'zod';

import type { ClassroomListItem } from '@/features/classrooms/types';
import type {
  addQuestionToQuizSchema,
  createQuizSchema,
  quizAttemptStatuses,
  quizOptionLabels,
  reorderQuestionsSchema,
  startQuizAttemptSchema,
  submitQuizAttemptSchema,
  updateQuestionSchema,
  updateQuizSchema,
} from '@/features/quizzes/schemas';

export type QuizOptionLabel = (typeof quizOptionLabels)[number];
export type QuizAttemptStatus = (typeof quizAttemptStatuses)[number];

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type AddQuestionToQuizInput = z.infer<typeof addQuestionToQuizSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type ReorderQuestionsInput = z.infer<typeof reorderQuestionsSchema>;
export type StartQuizAttemptInput = z.infer<typeof startQuizAttemptSchema>;
export type SubmitQuizAttemptInput = z.infer<typeof submitQuizAttemptSchema>;

export type QuizListItem = {
  id: string;
  professorId: string;
  classroomId: string | null;
  title: string;
  description: string;
  totalPoints: number;
  weight: number;
  timeLimitMinutes: number;
  quizDate: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type QuizOption = {
  id: string;
  questionId: string;
  label: QuizOptionLabel;
  content: string;
  isCorrect?: boolean;
};

export type QuizQuestion = {
  id: string;
  quizId: string;
  sequenceNumber: number;
  content: string;
  points: number;
  hasNegativePoints: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  options: QuizOption[];
};

export type QuizForEditing = QuizListItem & {
  questions: QuizQuestion[];
};

export type QuizForTaking = QuizListItem & {
  questions: Array<Omit<QuizQuestion, 'options'> & {
    options: Array<Omit<QuizOption, 'isCorrect'>>;
  }>;
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  studentId: string;
  startedAt: Date | string;
  submittedAt: Date | string | null;
  timeSpentSeconds: number | null;
  score: number;
  maxScore: number;
  accuracyPercent: number;
  status: QuizAttemptStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type QuizAnswer = {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeSpentSeconds: number | null;
};

export type QuizResult = {
  attempt: QuizAttempt;
  quiz: QuizListItem;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
};

export type QuizSortOrder = 'desc' | 'asc';
export type QuizFilterMode = 'all' | 'classroom' | 'general' | 'completed';
export type QuizToastTone = 'success' | 'error' | 'info';
export type QuizToastStatusCode = number | string;

export type QuizCardItem = QuizListItem & {
  questionCount: number;
  classroomTitle?: string | null;
  attempt?: QuizAttempt | null;
};

export type QuizzesDashboardHeaderProps = {
  isProfessor: boolean;
  search: string;
  sortOrder: QuizSortOrder;
  onSearchChange: (value: string) => void;
  onSortOrderChange: (value: QuizSortOrder) => void;
  onCreateQuiz: () => void;
};

export type QuizCardProps = {
  quiz: QuizCardItem;
  isProfessor: boolean;
  onManage: (quiz: QuizCardItem) => void;
  onTake: (quiz: QuizCardItem) => void;
  onDelete: (quiz: QuizCardItem) => void;
  animationDelayMs?: number;
};

export type QuizActionsMenuProps = {
  canDelete: boolean;
  quizTitle: string;
  onDelete: () => void;
};

export type CreateQuizModalProps = {
  isOpen: boolean;
  isSaving: boolean;
  classrooms: ClassroomListItem[];
  error?: string | null;
  onClose: () => void;
  onSubmit: (input: CreateQuizInput) => void;
};

export type QuizOptionDraft = {
  label: QuizOptionLabel;
  content: string;
  isCorrect: boolean;
};

export type CreateQuestionModalProps = {
  quiz: QuizListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onQuestionAdded: () => void;
  onToast: (message: string, tone?: QuizToastTone, statusCode?: QuizToastStatusCode) => void;
};

export type QuizDetailsModalProps = {
  quiz: QuizListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (quiz: QuizListItem) => void;
  onChanged?: () => void;
  onToast: (message: string, tone?: QuizToastTone, statusCode?: QuizToastStatusCode) => void;
};

export type StudentQuizInfoModalProps = {
  quiz: QuizCardItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: (quiz: QuizCardItem) => void;
};

export type TakeQuizModalProps = {
  quiz: QuizListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  onToast: (message: string, tone?: QuizToastTone, statusCode?: QuizToastStatusCode) => void;
};
