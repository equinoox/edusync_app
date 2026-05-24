import {
  createAnswerRecords,
  createAttemptRecord,
  getAnswersByAttemptId,
  getAttemptByQuizAndStudent,
  getAttemptRecordById,
  getAttemptsByStudent,
  getAttemptWithQuiz,
  updateAttemptRecord,
} from '@/features/quizzes/repositories/quiz-attempts.repository';
import {
  getOptionsByQuestionIds,
  getQuestionsByQuizId,
  getQuizRecordById,
} from '@/features/quizzes/repositories/quizzes.repository';
import {
  assertCurrentStudentCanTakeQuiz,
  getQuizForTaking,
} from '@/features/quizzes/server/quizzes.service';
import {
  startQuizAttemptSchema,
  submitQuizAttemptSchema,
} from '@/features/quizzes/schemas';
import type {
  QuizAttemptStatus,
  QuizResult,
  StartQuizAttemptInput,
  SubmitQuizAttemptInput,
} from '@/features/quizzes/types';
import { requireCurrentUserRole } from '@/features/auth/server/roles.service';

const getElapsedSeconds = (startedAt: Date | string) =>
  Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));

const isAttemptExpired = (
  startedAt: Date | string,
  timeLimitMinutes: number,
) => getElapsedSeconds(startedAt) > timeLimitMinutes * 60;

const sameSelection = (first: string[], second: string[]) => {
  if (first.length !== second.length) return false;

  const sortedFirst = [...first].sort();
  const sortedSecond = [...second].sort();
  return sortedFirst.every((value, index) => value === sortedSecond[index]);
};

export async function startQuizAttempt(input: StartQuizAttemptInput) {
  const values = startQuizAttemptSchema.parse(input);
  const { quiz, studentId } = await assertCurrentStudentCanTakeQuiz(values.quizId);
  const existingAttempt = await getAttemptByQuizAndStudent(quiz.id, studentId);

  if (existingAttempt) {
    if (existingAttempt.status === 'in_progress') {
      if (isAttemptExpired(existingAttempt.startedAt, quiz.timeLimitMinutes)) {
        await updateAttemptRecord(existingAttempt.id, {
          status: 'expired',
          timeSpentSeconds: quiz.timeLimitMinutes * 60,
          maxScore: quiz.totalPoints,
        });
        throw new Error('Quiz attempt has expired');
      }

      return {
        attempt: existingAttempt,
        quiz: await getQuizForTaking(quiz.id),
      };
    }

    throw new Error('You have already taken this quiz');
  }

  const attempt = await createAttemptRecord({
    quizId: quiz.id,
    studentId,
    maxScore: quiz.totalPoints,
    status: 'in_progress',
  });

  return {
    attempt,
    quiz: await getQuizForTaking(quiz.id),
  };
}

export async function submitQuizAttempt(input: SubmitQuizAttemptInput) {
  const { userId } = await requireCurrentUserRole('student');
  const values = submitQuizAttemptSchema.parse(input);
  const record = await getAttemptWithQuiz(values.attemptId);

  if (!record || record.attempt.studentId !== userId) {
    throw new Error('Quiz attempt not found');
  }

  if (record.attempt.status !== 'in_progress') {
    throw new Error('Quiz attempt is already finished');
  }

  if (isAttemptExpired(record.attempt.startedAt, record.quiz.timeLimitMinutes)) {
    await updateAttemptRecord(record.attempt.id, {
      status: 'expired',
      timeSpentSeconds: record.quiz.timeLimitMinutes * 60,
      maxScore: record.quiz.totalPoints,
    });
    throw new Error('Quiz attempt has expired');
  }

  const questions = await getQuestionsByQuizId(record.quiz.id);
  const options = await getOptionsByQuestionIds(
    questions.map(question => question.id),
  );
  const answersByQuestionId = new Map(
    values.answers.map(answer => [answer.questionId, answer]),
  );

  if (
    answersByQuestionId.size !== values.answers.length ||
    answersByQuestionId.size !== questions.length
  ) {
    throw new Error('Every question must be answered');
  }

  const answerRecords = questions.map(question => {
    const answer = answersByQuestionId.get(question.id);

    if (!answer) {
      throw new Error('Every question must be answered');
    }

    const questionOptions = options.filter(option => option.questionId === question.id);
    const validOptionIds = new Set(questionOptions.map(option => option.id));

    const uniqueSelectedOptionIds = new Set(answer.selectedOptionIds);

    if (
      answer.selectedOptionIds.length === 0 ||
      uniqueSelectedOptionIds.size !== answer.selectedOptionIds.length ||
      answer.selectedOptionIds.some(optionId => !validOptionIds.has(optionId))
    ) {
      throw new Error('Selected options are invalid');
    }

    const correctOptionIds = questionOptions
      .filter(option => option.isCorrect)
      .map(option => option.id);
    const isCorrect = sameSelection(answer.selectedOptionIds, correctOptionIds);
    const points = Number(question.points);
    const pointsEarned = isCorrect
      ? points
      : question.hasNegativePoints
        ? -(points / 2)
        : 0;

    return {
      attemptId: record.attempt.id,
      questionId: question.id,
      selectedOptionIds: answer.selectedOptionIds,
      isCorrect,
      pointsEarned,
      timeSpentSeconds: answer.timeSpentSeconds ?? null,
    };
  });

  const correctCount = answerRecords.filter(answer => answer.isCorrect).length;
  const score = answerRecords.reduce(
    (total, answer) => total + answer.pointsEarned,
    0,
  );
  const maxScore = questions.reduce(
    (total, question) => total + Number(question.points),
    0,
  );
  const accuracyPercent =
    questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
  const timeSpentSeconds = getElapsedSeconds(record.attempt.startedAt);

  await createAnswerRecords(answerRecords);
  const attempt = await updateAttemptRecord(record.attempt.id, {
    submittedAt: new Date(),
    timeSpentSeconds,
    score,
    maxScore,
    accuracyPercent,
    status: 'submitted',
  });

  return attempt;
}

export async function getMyQuizAttempts() {
  const { userId } = await requireCurrentUserRole('student');
  return getAttemptsByStudent(userId);
}

export async function getMyQuizResult(attemptId: string): Promise<QuizResult> {
  const { userId } = await requireCurrentUserRole('student');
  const attempt = await getAttemptRecordById(attemptId);

  if (!attempt || attempt.studentId !== userId) {
    throw new Error('Quiz attempt not found');
  }

  if (attempt.status === 'in_progress') {
    throw new Error('Quiz attempt is not submitted yet');
  }

  const quiz = await getQuizRecordById(attempt.quizId);

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  const questions = await getQuestionsByQuizId(quiz.id);
  const options = await getOptionsByQuestionIds(
    questions.map(question => question.id),
  );
  const answers = await getAnswersByAttemptId(attempt.id);

  return {
    attempt: {
      ...attempt,
      status: attempt.status as QuizAttemptStatus,
    },
    quiz,
    answers,
    questions: questions.map(question => ({
      ...question,
      options: options
        .filter(option => option.questionId === question.id)
        .map(option => ({
          ...option,
          label: option.label as 'a' | 'b' | 'c' | 'd' | 'e',
        })),
    })),
  };
}
