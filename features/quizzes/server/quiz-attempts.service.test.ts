import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { quizzes } from '@/lib/db/schema/quizzes';
import { addQuestionToQuiz, createQuiz } from '@/features/quizzes/server/quizzes.service';
import {
  getMyQuizAttempts,
  startQuizAttempt,
  submitQuizAttempt,
} from '@/features/quizzes/server/quiz-attempts.service';

const PROFESSOR_ID = 'test-professor-vitest';
const STUDENT_ID = 'test-student-vitest';

const currentUser = vi.hoisted(() => ({
  userId: 'test-professor-vitest',
  role: 'professor' as 'professor' | 'student',
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(async () => ({ userId: currentUser.userId })),
  clerkClient: vi.fn(async () => ({
    users: {
      getUser: vi.fn(async () => ({
        publicMetadata: { role: currentUser.role },
      })),
    },
  })),
}));

describe('submitQuizAttempt', () => {
  let quizId: string;
  let questionOkId: string;
  let optionOkCorrectId: string;
  let questionNegId: string;
  let optionNegWrongId: string;

  // Kviz sa dva pitanja se iznova kreira pre svakog testa: jedno pitanje
  // bez negativnih poena i jedno sa negativnim poenima, kako bi obe grane
  // logike bodovanja iz submitQuizAttempt bile pokrivene.
  beforeEach(async () => {
    currentUser.role = 'professor';
    currentUser.userId = PROFESSOR_ID;

    const quiz = await createQuiz({
      classroomId: null,
      title: 'Test - Bodovanje kviza',
      description: 'Kviz za testiranje logike bodovanja pokušaja.',
      weight: 1,
      timeLimitMinutes: 20,
      quizDate: null,
    });
    quizId = quiz.id;

    const questionOk = await addQuestionToQuiz({
      quizId,
      content: 'Pitanje bez negativnih poena',
      points: 2,
      hasNegativePoints: false,
      options: [
        { label: 'a', content: 'Tačno', isCorrect: true },
        { label: 'b', content: 'Netačno', isCorrect: false },
      ],
    });
    questionOkId = questionOk.id;
    optionOkCorrectId = questionOk.options.find(option => option.isCorrect)!.id;

    const questionNeg = await addQuestionToQuiz({
      quizId,
      content: 'Pitanje sa negativnim poenima',
      points: 4,
      hasNegativePoints: true,
      options: [
        { label: 'a', content: 'Tačno', isCorrect: true },
        { label: 'b', content: 'Netačno', isCorrect: false },
      ],
    });
    questionNegId = questionNeg.id;
    optionNegWrongId = questionNeg.options.find(
      option => !option.isCorrect,
    )!.id;
  });

  afterEach(async () => {
    await db.delete(quizzes).where(eq(quizzes.id, quizId));
  });

  it('boduje tačan i netačan (negativno bodovan) odgovor i potom prikazuje pokušaj u listi studenta', async () => {
    currentUser.role = 'student';
    currentUser.userId = STUDENT_ID;

    const { attempt } = await startQuizAttempt({ quizId });

    const submitted = await submitQuizAttempt({
      attemptId: attempt.id,
      answers: [
        { questionId: questionOkId, selectedOptionIds: [optionOkCorrectId] },
        { questionId: questionNegId, selectedOptionIds: [optionNegWrongId] },
      ],
    });

    expect(submitted).toMatchObject({
      status: 'submitted',
      maxScore: 6, // 2 + 4
      score: 0, // +2 (tačan odgovor) - 2 (pola od 4 poena za netačan odgovor sa negativnim bodovanjem)
      accuracyPercent: 50, // 1 od 2 pitanja tačno
    });

    const myAttempts = await getMyQuizAttempts();
    expect(myAttempts.map(item => item.id)).toContain(attempt.id);
  });

  it('odbija predaju pokušaja ako nije odgovoreno na svako pitanje', async () => {
    currentUser.role = 'student';
    currentUser.userId = STUDENT_ID;

    const { attempt } = await startQuizAttempt({ quizId });

    await expect(
      submitQuizAttempt({
        attemptId: attempt.id,
        answers: [
          { questionId: questionOkId, selectedOptionIds: [optionOkCorrectId] },
        ],
      }),
    ).rejects.toThrow('Every question must be answered');
  });
});
