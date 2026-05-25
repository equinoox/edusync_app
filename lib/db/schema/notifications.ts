import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { calendarEvents } from '@/lib/db/schema/calendar';
import {
  classroomMaterials,
  classrooms,
} from '@/lib/db/schema/classrooms';
import { quizzes } from '@/lib/db/schema/quizzes';
import { nanoid } from '@/lib/utils';

export const notifications = pgTable(
  'notifications',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    userId: varchar('user_id', { length: 191 }).notNull(),
    type: varchar('type', { length: 64 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    link: text('link'),
    read: boolean('read').notNull().default(false),
    relatedClassroomId: varchar('related_classroom_id', {
      length: 191,
    }).references(() => classrooms.id, { onDelete: 'cascade' }),
    relatedQuizId: varchar('related_quiz_id', { length: 191 }).references(
      () => quizzes.id,
      { onDelete: 'cascade' },
    ),
    relatedMaterialId: varchar('related_material_id', {
      length: 191,
    }).references(() => classroomMaterials.id, { onDelete: 'cascade' }),
    relatedCalendarEventId: varchar('related_calendar_event_id', {
      length: 191,
    }).references(() => calendarEvents.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  table => ({
    notificationUserCreatedAtIdx: index('notification_user_created_at_idx').on(
      table.userId,
      table.createdAt,
    ),
    notificationUserReadIdx: index('notification_user_read_idx').on(
      table.userId,
      table.read,
    ),
    notificationCalendarUnique: uniqueIndex(
      'notification_calendar_event_unique',
    ).on(table.userId, table.type, table.relatedCalendarEventId),
  }),
);
