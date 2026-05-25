import { z } from 'zod';

export const notificationTypes = [
  'calendar_event_today',
  'classroom_added',
  'classroom_document_added',
  'classroom_quiz_added',
] as const;

export const createNotificationForStudentSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(notificationTypes),
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(2000),
  link: z.string().min(1).nullable().optional(),
  relatedClassroomId: z.string().min(1).nullable().optional(),
  relatedQuizId: z.string().min(1).nullable().optional(),
  relatedMaterialId: z.string().min(1).nullable().optional(),
  relatedCalendarEventId: z.string().min(1).nullable().optional(),
});

export const createNotificationsForClassroomStudentsSchema =
  createNotificationForStudentSchema.omit({ userId: true }).extend({
    classroomId: z.string().min(1),
  });
