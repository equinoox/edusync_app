import { z } from 'zod';

export const quizOptionLabels = ['a', 'b', 'c', 'd', 'e'] as const;
export const quizAttemptStatuses = [
  'in_progress',
  'submitted',
  'expired',
] as const;

const nullableClassroomIdSchema = z
  .string()
  .min(1)
  .nullable()
  .optional();

export const quizOptionSchema = z.object({
  id: z.string().min(1).optional(),
  label: z.enum(quizOptionLabels),
  content: z.string().min(1),
  isCorrect: z.boolean(),
});

const optionsSchema = z
  .array(quizOptionSchema)
  .min(2)
  .max(5)
  .superRefine((options, context) => {
    const labels = new Set(options.map(option => option.label));

    if (labels.size !== options.length) {
      context.addIssue({
        code: 'custom',
        message: 'Option labels must be unique',
      });
    }

    if (!options.some(option => option.isCorrect)) {
      context.addIssue({
        code: 'custom',
        message: 'At least one option must be correct',
      });
    }
  });

export const createQuizSchema = z.object({
  classroomId: nullableClassroomIdSchema,
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional().default(''),
  weight: z.number().min(0).default(0),
  timeLimitMinutes: z.number().int().positive(),
});

export const updateQuizSchema = createQuizSchema.partial();

export const addQuestionToQuizSchema = z.object({
  quizId: z.string().min(1),
  sequenceNumber: z.number().int().positive().optional(),
  content: z.string().min(1),
  points: z.number().positive(),
  hasNegativePoints: z.boolean().default(false),
  options: optionsSchema,
});

export const updateQuestionSchema = z.object({
  sequenceNumber: z.number().int().positive().optional(),
  content: z.string().min(1).optional(),
  points: z.number().positive().optional(),
  hasNegativePoints: z.boolean().optional(),
  options: optionsSchema.optional(),
});

export const reorderQuestionsSchema = z.object({
  quizId: z.string().min(1),
  questionIds: z.array(z.string().min(1)).min(1),
});

export const submitQuizAnswerSchema = z.object({
  questionId: z.string().min(1),
  selectedOptionIds: z.array(z.string().min(1)),
  timeSpentSeconds: z.number().int().nonnegative().nullable().optional(),
});

export const submitQuizAttemptSchema = z.object({
  attemptId: z.string().min(1),
  answers: z.array(submitQuizAnswerSchema).min(1),
});

export const startQuizAttemptSchema = z.object({
  quizId: z.string().min(1),
});
