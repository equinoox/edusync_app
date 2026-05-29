import { and, asc, desc, eq, gte, inArray, isNotNull, isNull, or } from 'drizzle-orm';

import { classroomMemberships } from '@/lib/db/schema/classrooms';
import { db } from '@/lib/db';
import {
  quizQuestionOptions,
  quizQuestions,
  quizzes,
} from '@/lib/db/schema/quizzes';
import type { QuizOptionLabel } from '@/features/quizzes/types';

export async function createQuizRecord(input: typeof quizzes.$inferInsert) {
  const [quiz] = await db.insert(quizzes).values(input).returning();
  return quiz;
}

export async function getQuizRecordById(quizId: string) {
  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, quizId))
    .limit(1);

  return quiz;
}

export async function getQuizzesByProfessor(professorId: string) {
  return db
    .select()
    .from(quizzes)
    .where(eq(quizzes.professorId, professorId))
    .orderBy(desc(quizzes.createdAt));
}

export async function getGeneralQuizzes() {
  return db
    .select()
    .from(quizzes)
    .where(isNull(quizzes.classroomId))
    .orderBy(desc(quizzes.createdAt));
}

export async function getAvailableQuizzesForStudent(studentId: string) {
  const memberships = await db
    .select({ classroomId: classroomMemberships.classroomId })
    .from(classroomMemberships)
    .where(eq(classroomMemberships.studentId, studentId));

  const classroomIds = memberships.map(membership => membership.classroomId);

  return db
    .select()
    .from(quizzes)
    .where(
      classroomIds.length > 0
        ? or(isNull(quizzes.classroomId), inArray(quizzes.classroomId, classroomIds))
        : isNull(quizzes.classroomId),
    )
    .orderBy(desc(quizzes.createdAt));
}

export async function getQuizzesByClassroom(classroomId: string) {
  return db
    .select()
    .from(quizzes)
    .where(eq(quizzes.classroomId, classroomId))
    .orderBy(desc(quizzes.createdAt));
}

export async function getUpcomingQuizzesByClassroom(
  classroomId: string,
  fromDate: Date,
) {
  return db
    .select()
    .from(quizzes)
    .where(
      and(
        eq(quizzes.classroomId, classroomId),
        isNotNull(quizzes.quizDate),
        gte(quizzes.quizDate, fromDate),
      ),
    )
    .orderBy(asc(quizzes.quizDate), asc(quizzes.createdAt));
}

export async function getUpcomingQuizzesByProfessor(
  professorId: string,
  fromDate: Date,
) {
  return db
    .select()
    .from(quizzes)
    .where(
      and(
        eq(quizzes.professorId, professorId),
        isNotNull(quizzes.quizDate),
        gte(quizzes.quizDate, fromDate),
      ),
    )
    .orderBy(asc(quizzes.quizDate), asc(quizzes.createdAt));
}

export async function getUpcomingQuizzesForStudent(
  studentId: string,
  fromDate: Date,
) {
  const memberships = await db
    .select({ classroomId: classroomMemberships.classroomId })
    .from(classroomMemberships)
    .where(eq(classroomMemberships.studentId, studentId));

  const classroomIds = memberships.map(membership => membership.classroomId);

  return db
    .select()
    .from(quizzes)
    .where(
      and(
        isNotNull(quizzes.quizDate),
        gte(quizzes.quizDate, fromDate),
        classroomIds.length > 0
          ? or(isNull(quizzes.classroomId), inArray(quizzes.classroomId, classroomIds))
          : isNull(quizzes.classroomId),
      ),
    )
    .orderBy(asc(quizzes.quizDate), asc(quizzes.createdAt));
}

export async function updateQuizRecord(
  quizId: string,
  professorId: string,
  input: Partial<typeof quizzes.$inferInsert>,
) {
  const [quiz] = await db
    .update(quizzes)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(quizzes.id, quizId), eq(quizzes.professorId, professorId)))
    .returning();

  return quiz;
}

export async function updateQuizTotalPoints(quizId: string, totalPoints: number) {
  const [quiz] = await db
    .update(quizzes)
    .set({ totalPoints, updatedAt: new Date() })
    .where(eq(quizzes.id, quizId))
    .returning();

  return quiz;
}

export async function deleteQuizRecord(quizId: string, professorId: string) {
  const [quiz] = await db
    .delete(quizzes)
    .where(and(eq(quizzes.id, quizId), eq(quizzes.professorId, professorId)))
    .returning();

  return quiz;
}

export async function createQuestionRecord(
  input: typeof quizQuestions.$inferInsert,
) {
  const [question] = await db.insert(quizQuestions).values(input).returning();
  return question;
}

export async function getQuestionWithQuiz(questionId: string) {
  const [record] = await db
    .select({
      question: quizQuestions,
      quiz: quizzes,
    })
    .from(quizQuestions)
    .innerJoin(quizzes, eq(quizzes.id, quizQuestions.quizId))
    .where(eq(quizQuestions.id, questionId))
    .limit(1);

  return record;
}

export async function getQuestionsByQuizId(quizId: string) {
  return db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(asc(quizQuestions.sequenceNumber), asc(quizQuestions.createdAt));
}

export async function updateQuestionRecord(
  questionId: string,
  input: Partial<typeof quizQuestions.$inferInsert>,
) {
  const [question] = await db
    .update(quizQuestions)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(quizQuestions.id, questionId))
    .returning();

  return question;
}

export async function deleteQuestionRecord(questionId: string) {
  const [question] = await db
    .delete(quizQuestions)
    .where(eq(quizQuestions.id, questionId))
    .returning();

  return question;
}

export async function updateQuestionSequenceNumber(
  questionId: string,
  sequenceNumber: number,
) {
  const [question] = await db
    .update(quizQuestions)
    .set({ sequenceNumber, updatedAt: new Date() })
    .where(eq(quizQuestions.id, questionId))
    .returning();

  return question;
}

export async function createQuestionOptions(
  values: Array<typeof quizQuestionOptions.$inferInsert>,
) {
  if (values.length === 0) {
    return [];
  }

  return db.insert(quizQuestionOptions).values(values).returning();
}

export async function replaceQuestionOptions(
  questionId: string,
  values: Array<Omit<typeof quizQuestionOptions.$inferInsert, 'questionId'>>,
) {
  await db
    .delete(quizQuestionOptions)
    .where(eq(quizQuestionOptions.questionId, questionId));

  return createQuestionOptions(
    values.map(value => ({ ...value, questionId })),
  );
}

export async function getOptionsByQuestionId(questionId: string) {
  return db
    .select()
    .from(quizQuestionOptions)
    .where(eq(quizQuestionOptions.questionId, questionId))
    .orderBy(asc(quizQuestionOptions.label));
}

export async function getOptionsByQuestionIds(questionIds: string[]) {
  if (questionIds.length === 0) {
    return [];
  }

  return db
    .select()
    .from(quizQuestionOptions)
    .where(inArray(quizQuestionOptions.questionId, questionIds))
    .orderBy(asc(quizQuestionOptions.label));
}

export function normalizeOptionLabel(label: string) {
  return label as QuizOptionLabel;
}
