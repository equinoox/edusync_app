import { z } from 'zod';

export const calendarEventTypes = ['custom', 'quiz'] as const;

const dateStringSchema = z
  .string()
  .min(1)
  .refine(value => !Number.isNaN(new Date(value).getTime()), {
    message: 'Date is invalid',
  });

export const createCalendarEventSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional().default(''),
  date: dateStringSchema,
});

export const updateCalendarEventSchema = createCalendarEventSchema.partial();

export const getCalendarEventsByMonthSchema = z.object({
  year: z.number().int().min(1970).max(2200),
  month: z.number().int().min(0).max(11),
});

export const createQuizCalendarEventSchema = z.object({
  quizId: z.string().min(1),
  professorId: z.string().min(1),
  classroomId: z.string().min(1).nullable(),
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional().default(''),
  date: dateStringSchema.nullable(),
});
