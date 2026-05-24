import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { classrooms } from '@/lib/db/schema/classrooms';
import { nanoid } from '@/lib/utils';

export const quizzes = pgTable('quizzes', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  professorId: varchar('professor_id', { length: 191 }).notNull(),
  classroomId: varchar('classroom_id', { length: 191 }).references(
    () => classrooms.id,
    { onDelete: 'cascade' },
  ),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull().default(''),
  totalPoints: numeric('total_points', {
    precision: 10,
    scale: 2,
    mode: 'number',
  })
    .notNull()
    .default(0),
  weight: numeric('weight', { precision: 10, scale: 2, mode: 'number' })
    .notNull()
    .default(0),
  timeLimitMinutes: integer('time_limit_minutes').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

export const quizQuestions = pgTable('quiz_questions', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  quizId: varchar('quiz_id', { length: 191 })
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  sequenceNumber: integer('sequence_number').notNull(),
  content: text('content').notNull(),
  points: numeric('points', { precision: 10, scale: 2, mode: 'number' })
    .notNull(),
  hasNegativePoints: boolean('has_negative_points').notNull().default(false),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

export const quizQuestionOptions = pgTable(
  'quiz_question_options',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    questionId: varchar('question_id', { length: 191 })
      .notNull()
      .references(() => quizQuestions.id, { onDelete: 'cascade' }),
    label: varchar('label', { length: 1 }).notNull(),
    content: text('content').notNull(),
    isCorrect: boolean('is_correct').notNull().default(false),
  },
  table => ({
    questionOptionLabelUnique: uniqueIndex('question_option_label_unique').on(
      table.questionId,
      table.label,
    ),
  }),
);

export const quizAttempts = pgTable(
  'quiz_attempts',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    quizId: varchar('quiz_id', { length: 191 })
      .notNull()
      .references(() => quizzes.id, { onDelete: 'cascade' }),
    studentId: varchar('student_id', { length: 191 }).notNull(),
    startedAt: timestamp('started_at').notNull().default(sql`now()`),
    submittedAt: timestamp('submitted_at'),
    timeSpentSeconds: integer('time_spent_seconds'),
    score: numeric('score', { precision: 10, scale: 2, mode: 'number' })
      .notNull()
      .default(0),
    maxScore: numeric('max_score', { precision: 10, scale: 2, mode: 'number' })
      .notNull()
      .default(0),
    accuracyPercent: numeric('accuracy_percent', {
      precision: 5,
      scale: 2,
      mode: 'number',
    })
      .notNull()
      .default(0),
    status: varchar('status', { length: 32 }).notNull().default('in_progress'),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  table => ({
    quizStudentAttemptUnique: uniqueIndex('quiz_student_attempt_unique').on(
      table.quizId,
      table.studentId,
    ),
  }),
);

export const quizAnswers = pgTable(
  'quiz_answers',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    attemptId: varchar('attempt_id', { length: 191 })
      .notNull()
      .references(() => quizAttempts.id, { onDelete: 'cascade' }),
    questionId: varchar('question_id', { length: 191 })
      .notNull()
      .references(() => quizQuestions.id, { onDelete: 'cascade' }),
    selectedOptionIds: jsonb('selected_option_ids').$type<string[]>().notNull(),
    isCorrect: boolean('is_correct').notNull(),
    pointsEarned: numeric('points_earned', {
      precision: 10,
      scale: 2,
      mode: 'number',
    }).notNull(),
    timeSpentSeconds: integer('time_spent_seconds'),
  },
  table => ({
    attemptQuestionAnswerUnique: uniqueIndex('attempt_question_answer_unique').on(
      table.attemptId,
      table.questionId,
    ),
  }),
);
