import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  quizAnswers,
  quizAttempts,
  quizzes,
} from '@/lib/db/schema/quizzes';

export async function getAttemptByQuizAndStudent(
  quizId: string,
  studentId: string,
) {
  const [attempt] = await db
    .select()
    .from(quizAttempts)
    .where(
      and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.studentId, studentId),
      ),
    )
    .limit(1);

  return attempt;
}

export async function getAttemptRecordById(attemptId: string) {
  const [attempt] = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.id, attemptId))
    .limit(1);

  return attempt;
}

export async function getAttemptWithQuiz(attemptId: string) {
  const [record] = await db
    .select({
      attempt: quizAttempts,
      quiz: quizzes,
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizzes.id, quizAttempts.quizId))
    .where(eq(quizAttempts.id, attemptId))
    .limit(1);

  return record;
}

export async function createAttemptRecord(
  input: typeof quizAttempts.$inferInsert,
) {
  const [attempt] = await db.insert(quizAttempts).values(input).returning();
  return attempt;
}

export async function updateAttemptRecord(
  attemptId: string,
  input: Partial<typeof quizAttempts.$inferInsert>,
) {
  const [attempt] = await db
    .update(quizAttempts)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(quizAttempts.id, attemptId))
    .returning();

  return attempt;
}

export async function getAttemptsByStudent(studentId: string) {
  return db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.studentId, studentId))
    .orderBy(desc(quizAttempts.createdAt));
}

export async function createAnswerRecords(
  values: Array<typeof quizAnswers.$inferInsert>,
) {
  if (values.length === 0) {
    return [];
  }

  return db.insert(quizAnswers).values(values).returning();
}

export async function getAnswersByAttemptId(attemptId: string) {
  return db
    .select()
    .from(quizAnswers)
    .where(eq(quizAnswers.attemptId, attemptId));
}
