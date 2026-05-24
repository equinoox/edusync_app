import { sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { nanoid } from '@/lib/utils';

export const classrooms = pgTable('classrooms', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  professorId: varchar('professor_id', { length: 191 }).notNull(),
  icon: varchar('icon', { length: 64 }).notNull(),
  color: varchar('color', { length: 64 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

export const classroomMemberships = pgTable(
  'classroom_memberships',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    classroomId: varchar('classroom_id', { length: 191 })
      .notNull()
      .references(() => classrooms.id, { onDelete: 'cascade' }),
    studentId: varchar('student_id', { length: 191 }).notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
  },
  table => ({
    classroomStudentUnique: uniqueIndex('classroom_student_unique').on(
      table.classroomId,
      table.studentId,
    ),
  }),
);

export const lessons = pgTable(
  'lessons',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    classroomId: varchar('classroom_id', { length: 191 })
      .notNull()
      .references(() => classrooms.id, { onDelete: 'cascade' }),
    sequenceNumber: integer('sequence_number').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  table => ({
    lessonSequenceUnique: uniqueIndex('lesson_sequence_unique').on(
      table.classroomId,
      table.sequenceNumber,
    ),
  }),
);

export const lessonMaterials = pgTable('lesson_materials', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  lessonId: varchar('lesson_id', { length: 191 })
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  storageKey: text('storage_key'),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});
