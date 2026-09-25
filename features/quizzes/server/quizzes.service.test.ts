import { afterEach, describe, expect, it, vi } from 'vitest';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { quizzes } from '@/lib/db/schema/quizzes';
import {
  addQuestionToQuiz,
  createQuiz,
} from '@/features/quizzes/server/quizzes.service';
import { getQuizRecordById } from '@/features/quizzes/repositories/quizzes.repository';

const currentUser = vi.hoisted(() => ({
  userId: 'test-professor-vitest',
  role: 'professor' as const,
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

describe('createQuiz i addQuestionToQuiz', () => {
  const createdQuizIds: string[] = [];

  afterEach(async () => {
    // Brisanje kviza kroz ON DELETE CASCADE briše i njegova pitanja,
    // ponuđene odgovore i povezani kalendarski događaj.
    for (const id of createdQuizIds.splice(0)) {
      await db.delete(quizzes).where(eq(quizzes.id, id));
    }
  });

  it('kreira kviz sa nula bodova pre nego što mu se doda ijedno pitanje', async () => {
    const quiz = await createQuiz({
      classroomId: null,
      title: 'Test - Uvod u baze podataka',
      description: 'Kviz kreiran iz automatizovanog testa.',
      weight: 1,
      timeLimitMinutes: 20,
      quizDate: null,
    });

    createdQuizIds.push(quiz.id);
    expect(quiz.totalPoints).toBe(0);
  });

  it('ponovo izračunava totalPoints nakon svakog dodatog pitanja', async () => {
    const quiz = await createQuiz({
      classroomId: null,
      title: 'Test - Normalizacija baze podataka',
      description: 'Kviz sa više pitanja različite bodovne vrednosti.',
      weight: 1,
      timeLimitMinutes: 20,
      quizDate: null,
    });
    createdQuizIds.push(quiz.id);

    await addQuestionToQuiz({
      quizId: quiz.id,
      content: 'Šta je 1NF?',
      points: 2,
      hasNegativePoints: false,
      options: [
        { label: 'a', content: 'Tačan odgovor', isCorrect: true },
        { label: 'b', content: 'Netačan odgovor', isCorrect: false },
      ],
    });

    const secondQuestion = await addQuestionToQuiz({
      quizId: quiz.id,
      content: 'Šta je 2NF?',
      points: 3,
      hasNegativePoints: false,
      options: [
        { label: 'a', content: 'Tačan odgovor', isCorrect: true },
        { label: 'b', content: 'Netačan odgovor', isCorrect: false },
      ],
    });

    expect(secondQuestion.options).toHaveLength(2);

    const updatedQuiz = await getQuizRecordById(quiz.id);
    expect(updatedQuiz?.totalPoints).toBe(5); // 2 + 3
  });

  it('odbija pitanje kod kog nijedna ponuđena opcija nije označena kao tačna', async () => {
    const quiz = await createQuiz({
      classroomId: null,
      title: 'Test - Pitanje bez tačnog odgovora',
      description: 'Kviz za proveru validacije pitanja.',
      weight: 1,
      timeLimitMinutes: 20,
      quizDate: null,
    });
    createdQuizIds.push(quiz.id);

    await expect(
      addQuestionToQuiz({
        quizId: quiz.id,
        content: 'Pitanje bez tačnog odgovora',
        points: 1,
        hasNegativePoints: false,
        options: [
          { label: 'a', content: 'Prva opcija', isCorrect: false },
          { label: 'b', content: 'Druga opcija', isCorrect: false },
        ],
      }),
    ).rejects.toThrow();
  });
});
