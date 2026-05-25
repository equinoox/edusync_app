import { and, desc, eq, isNotNull } from 'drizzle-orm';

import { db } from '@/lib/db';
import { classrooms } from '@/lib/db/schema/classrooms';
import { quizAttempts, quizzes } from '@/lib/db/schema/quizzes';

export async function getSubmittedProgressAttemptsByStudent(studentId: string) {
  return db
    .select({
      attemptId: quizAttempts.id,
      quizId: quizzes.id,
      quizTitle: quizzes.title,
      classroomId: quizzes.classroomId,
      classroomTitle: classrooms.title,
      score: quizAttempts.score,
      maxScore: quizAttempts.maxScore,
      accuracyPercent: quizAttempts.accuracyPercent,
      timeSpentSeconds: quizAttempts.timeSpentSeconds,
      timeLimitMinutes: quizzes.timeLimitMinutes,
      weight: quizzes.weight,
      submittedAt: quizAttempts.submittedAt,
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizzes.id, quizAttempts.quizId))
    .leftJoin(classrooms, eq(classrooms.id, quizzes.classroomId))
    .where(
      and(
        eq(quizAttempts.studentId, studentId),
        eq(quizAttempts.status, 'submitted'),
        isNotNull(quizAttempts.submittedAt),
      ),
    )
    .orderBy(desc(quizAttempts.submittedAt));
}
