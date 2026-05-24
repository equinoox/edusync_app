'use server';

import {
  addQuestionToQuiz,
  createQuiz,
  deleteQuestion,
  deleteQuiz,
  getAvailableQuizzes,
  getClassroomQuizzes,
  getGeneralQuizzesForCurrentUser,
  getProfessorQuizzes,
  getQuizForEditing,
  getQuizForTaking,
  reorderQuestions,
  updateQuestion,
  updateQuiz,
} from '@/features/quizzes/server/quizzes.service';
import type {
  AddQuestionToQuizInput,
  CreateQuizInput,
  ReorderQuestionsInput,
  UpdateQuestionInput,
  UpdateQuizInput,
} from '@/features/quizzes/types';

const toActionError = (error: unknown) =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : 'Something went wrong';

export async function createQuizAction(input: CreateQuizInput) {
  try {
    return await createQuiz(input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateQuizAction(quizId: string, input: UpdateQuizInput) {
  try {
    return await updateQuiz(quizId, input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteQuizAction(quizId: string) {
  try {
    return await deleteQuiz(quizId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function addQuestionToQuizAction(input: AddQuestionToQuizInput) {
  try {
    return await addQuestionToQuiz(input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateQuestionAction(
  questionId: string,
  input: UpdateQuestionInput,
) {
  try {
    return await updateQuestion(questionId, input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteQuestionAction(questionId: string) {
  try {
    return await deleteQuestion(questionId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function reorderQuestionsAction(input: ReorderQuestionsInput) {
  try {
    return await reorderQuestions(input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function getProfessorQuizzesAction() {
  try {
    return await getProfessorQuizzes();
  } catch (error) {
    return toActionError(error);
  }
}

export async function getQuizForEditingAction(quizId: string) {
  try {
    return await getQuizForEditing(quizId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function getAvailableQuizzesAction() {
  try {
    return await getAvailableQuizzes();
  } catch (error) {
    return toActionError(error);
  }
}

export async function getGeneralQuizzesAction() {
  try {
    return await getGeneralQuizzesForCurrentUser();
  } catch (error) {
    return toActionError(error);
  }
}

export async function getClassroomQuizzesAction(classroomId: string) {
  try {
    return await getClassroomQuizzes(classroomId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function getQuizForTakingAction(quizId: string) {
  try {
    return await getQuizForTaking(quizId);
  } catch (error) {
    return toActionError(error);
  }
}
