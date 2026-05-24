'use server';

import {
  getMyQuizAttempts,
  getMyQuizResult,
  startQuizAttempt,
  submitQuizAttempt,
} from '@/features/quizzes/server/quiz-attempts.service';
import type {
  StartQuizAttemptInput,
  SubmitQuizAttemptInput,
} from '@/features/quizzes/types';

const toActionError = (error: unknown) =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : 'Something went wrong';

export async function startQuizAttemptAction(input: StartQuizAttemptInput) {
  try {
    return await startQuizAttempt(input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function submitQuizAttemptAction(input: SubmitQuizAttemptInput) {
  try {
    return await submitQuizAttempt(input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function getMyQuizAttemptsAction() {
  try {
    return await getMyQuizAttempts();
  } catch (error) {
    return toActionError(error);
  }
}

export async function getMyQuizResultAction(attemptId: string) {
  try {
    return await getMyQuizResult(attemptId);
  } catch (error) {
    return toActionError(error);
  }
}
