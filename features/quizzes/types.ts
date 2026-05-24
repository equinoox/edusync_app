import type { z } from 'zod';

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
