import { sql } from 'drizzle-orm';
import {
  integer,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { nanoid } from '@/lib/utils';

export const classrooms = pgTable(
  'classrooms',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    professorId: varchar('professor_id', { length: 191 }).notNull(),
    icon: varchar('icon', { length: 64 }).notNull(),
    color: varchar('color', { length: 64 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  table => ({
    classroomProfessorCreatedAtIdx: index(
      'classroom_professor_created_at_idx',
    ).on(table.professorId, table.createdAt),
  }),
);

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
    classroomMembershipStudentCreatedAtIdx: index(
      'classroom_membership_student_created_at_idx',
    ).on(table.studentId, table.createdAt),
    classroomStudentUnique: uniqueIndex('classroom_student_unique').on(
      table.classroomId,
      table.studentId,
    ),
  }),
);

export const classroomMaterials = pgTable(
  'classroom_materials',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    classroomId: varchar('classroom_id', { length: 191 })
      .notNull()
      .references(() => classrooms.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileUrl: text('file_url').notNull(),
    storageKey: text('storage_key'),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    size: integer('size').notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  table => ({
    classroomMaterialClassroomCreatedAtIdx: index(
      'classroom_material_classroom_created_at_idx',
    ).on(table.classroomId, table.createdAt),
  }),
);
