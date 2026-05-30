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

const nullableQuizDateSchema = z
  .string()
  .min(1)
  .refine(value => !Number.isNaN(new Date(value).getTime()), {
    message: 'Quiz date is invalid',
  })
  .nullable()
  .optional();

export const quizOptionSchema = z.object({
  id: z.string().min(1).optional(),
  label: z.enum(quizOptionLabels),
  content: z.string().trim().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

const optionsSchema = z
  .array(quizOptionSchema)
  .min(2, 'Add at least two options')
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
        message: 'Mark at least one correct answer',
      });
    }
  });

export const createQuizSchema = z.object({
  classroomId: nullableClassroomIdSchema,
  title: z.string().trim().min(1, 'Quiz title is required').max(255),
  description: z.string().trim().min(1, 'Quiz description is required').max(2000),
  weight: z.number().positive('Quiz weight must be greater than 0'),
  timeLimitMinutes: z.number().int().positive('Quiz duration must be greater than 0'),
  quizDate: nullableQuizDateSchema,
});

export const updateQuizSchema = createQuizSchema.partial();

export const addQuestionToQuizSchema = z.object({
  quizId: z.string().min(1),
  sequenceNumber: z.number().int().positive().optional(),
  content: z.string().trim().min(1, 'Question text is required'),
  points: z.number().positive('Question points must be greater than 0'),
  hasNegativePoints: z.boolean().default(false),
  options: optionsSchema,
});

export const updateQuestionSchema = z.object({
  sequenceNumber: z.number().int().positive().optional(),
  content: z.string().trim().min(1).optional(),
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
