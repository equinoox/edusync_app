import { sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { classrooms } from '@/lib/db/schema/classrooms';
import { quizzes } from '@/lib/db/schema/quizzes';
import { nanoid } from '@/lib/utils';

export const calendarEvents = pgTable(
  'calendar_events',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    userId: varchar('user_id', { length: 191 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull().default(''),
    date: timestamp('date').notNull(),
    eventType: varchar('event_type', { length: 32 }).notNull().default('custom'),
    quizId: varchar('quiz_id', { length: 191 }).references(() => quizzes.id, {
      onDelete: 'cascade',
    }),
    classroomId: varchar('classroom_id', { length: 191 }).references(
      () => classrooms.id,
      { onDelete: 'cascade' },
    ),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  table => ({
    calendarEventUserDateIdx: index('calendar_event_user_date_idx').on(
      table.userId,
      table.date,
    ),
    calendarEventQuizIdx: index('calendar_event_quiz_idx').on(table.quizId),
    calendarEventTypeDateIdx: index('calendar_event_type_date_idx').on(
      table.eventType,
      table.date,
    ),
  }),
);
