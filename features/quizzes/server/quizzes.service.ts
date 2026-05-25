import {
  assertProfessorOwnsClassroom,
  checkStudentAccessToClassroom,
} from '@/features/classrooms/server/classrooms.service';
import {
  checkQuizCanBeTakenToday,
  createQuizCalendarEvent,
} from '@/features/calendar/server/calendar.service';
import { createNotificationsForClassroomStudents } from '@/features/notifications/server/notifications.service';
import { getCurrentUserWithRole, requireCurrentUserRole } from '@/features/auth/server/roles.service';
import {
  addQuestionToQuizSchema,
  createQuizSchema,
  reorderQuestionsSchema,
  updateQuestionSchema,
  updateQuizSchema,
} from '@/features/quizzes/schemas';
import type {
  AddQuestionToQuizInput,
  CreateQuizInput,
  QuizForEditing,
  QuizForTaking,
  ReorderQuestionsInput,
  UpdateQuestionInput,
  UpdateQuizInput,
} from '@/features/quizzes/types';
import {
  createQuestionOptions,
  createQuestionRecord,
  createQuizRecord,
  deleteQuestionRecord,
  deleteQuizRecord,
  getAvailableQuizzesForStudent,
  getGeneralQuizzes,
  getOptionsByQuestionIds,
  getQuestionWithQuiz,
  getQuestionsByQuizId,
  getQuizRecordById,
  getQuizzesByClassroom,
  getQuizzesByProfessor,
  replaceQuestionOptions,
  updateQuestionRecord,
  updateQuestionSequenceNumber,
  updateQuizRecord,
  updateQuizTotalPoints,
} from '@/features/quizzes/repositories/quizzes.repository';

const toQuestionWithOptions = async (quizId: string) => {
  const questions = await getQuestionsByQuizId(quizId);
  const options = await getOptionsByQuestionIds(
    questions.map(question => question.id),
  );

  return questions.map(question => ({
    ...question,
    options: options
      .filter(option => option.questionId === question.id)
      .map(option => ({
        ...option,
        label: option.label as 'a' | 'b' | 'c' | 'd' | 'e',
      })),
  }));
};

const normalizeQuizDate = (value: string | null | undefined) => {
  if (!value) return value === null ? null : undefined;

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      )
    : new Date(value);

  date.setHours(0, 0, 0, 0);
  return date;
};

async function recalculateQuizPoints(quizId: string) {
  const questions = await getQuestionsByQuizId(quizId);
  const totalPoints = questions.reduce(
    (total, question) => total + Number(question.points),
    0,
  );

  await updateQuizTotalPoints(quizId, totalPoints);
  return totalPoints;
}

export async function assertProfessorOwnsQuiz(
  quizId: string,
  professorId: string,
) {
  const quiz = await getQuizRecordById(quizId);

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  if (quiz.professorId !== professorId) {
    throw new Error('Forbidden');
  }

  return quiz;
}

export async function assertCurrentStudentCanTakeQuiz(quizId: string) {
  const { userId } = await requireCurrentUserRole('student');
  const quiz = await getQuizRecordById(quizId);

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  if (quiz.classroomId) {
    const hasAccess = await checkStudentAccessToClassroom(
      quiz.classroomId,
      userId,
    );

    if (!hasAccess) {
      throw new Error('Forbidden');
    }
  }

  if (!checkQuizCanBeTakenToday(quiz.quizDate)) {
    throw new Error('This quiz can only be taken on its assigned date');
  }

  return { quiz, studentId: userId };
}

export async function createQuiz(input: CreateQuizInput) {
  const { userId } = await requireCurrentUserRole('professor');
  const values = createQuizSchema.parse(input);

  const classroom = values.classroomId
    ? await assertProfessorOwnsClassroom(values.classroomId, userId)
    : null;

  const quiz = await createQuizRecord({
    ...values,
    classroomId: values.classroomId ?? null,
    quizDate: normalizeQuizDate(values.quizDate),
    professorId: userId,
    totalPoints: 0,
  });

  await createQuizCalendarEvent({
    quizId: quiz.id,
    professorId: userId,
    classroomId: quiz.classroomId,
    title: quiz.title,
    description: quiz.description,
    date: quiz.quizDate,
  });

  if (classroom) {
    await createNotificationsForClassroomStudents({
      classroomId: classroom.id,
      type: 'classroom_quiz_added',
      title: 'New classroom quiz',
      message: `A new quiz was added to ${classroom.title}.`,
      link: `/quizzes?quizId=${quiz.id}`,
      relatedClassroomId: classroom.id,
      relatedQuizId: quiz.id,
    });
  }

  return quiz;
}

export async function updateQuiz(quizId: string, input: UpdateQuizInput) {
  const { userId } = await requireCurrentUserRole('professor');
  await assertProfessorOwnsQuiz(quizId, userId);
  const values = updateQuizSchema.parse(input);

  if (values.classroomId) {
    await assertProfessorOwnsClassroom(values.classroomId, userId);
  }

  const quiz = await updateQuizRecord(quizId, userId, {
    ...values,
    quizDate: normalizeQuizDate(values.quizDate),
  });

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  await createQuizCalendarEvent({
    quizId: quiz.id,
    professorId: userId,
    classroomId: quiz.classroomId,
    title: quiz.title,
    description: quiz.description,
    date: quiz.quizDate,
  });

  return quiz;
}

export async function deleteQuiz(quizId: string) {
  const { userId } = await requireCurrentUserRole('professor');
  await assertProfessorOwnsQuiz(quizId, userId);

  const quiz = await deleteQuizRecord(quizId, userId);

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  return quiz;
}

export async function addQuestionToQuiz(input: AddQuestionToQuizInput) {
  const { userId } = await requireCurrentUserRole('professor');
  const values = addQuestionToQuizSchema.parse(input);
  await assertProfessorOwnsQuiz(values.quizId, userId);

  const questions = await getQuestionsByQuizId(values.quizId);
  const sequenceNumber =
    values.sequenceNumber ??
    Math.max(0, ...questions.map(question => question.sequenceNumber)) + 1;

  const question = await createQuestionRecord({
    quizId: values.quizId,
    sequenceNumber,
    content: values.content,
    points: values.points,
    hasNegativePoints: values.hasNegativePoints,
  });

  await createQuestionOptions(
    values.options.map(option => ({
      questionId: question.id,
      label: option.label,
      content: option.content,
      isCorrect: option.isCorrect,
    })),
  );

  await recalculateQuizPoints(values.quizId);
  const questionWithOptions = (await toQuestionWithOptions(values.quizId)).find(
    item => item.id === question.id,
  );

  if (!questionWithOptions) {
    throw new Error('Question not found');
  }

  return questionWithOptions;
}

export async function updateQuestion(
  questionId: string,
  input: UpdateQuestionInput,
) {
  const { userId } = await requireCurrentUserRole('professor');
  const record = await getQuestionWithQuiz(questionId);

  if (!record) {
    throw new Error('Question not found');
  }

  if (record.quiz.professorId !== userId) {
    throw new Error('Forbidden');
  }

  const values = updateQuestionSchema.parse(input);
  const { options, ...questionValues } = values;

  if (Object.keys(questionValues).length > 0) {
    await updateQuestionRecord(questionId, questionValues);
  }

  if (options) {
    await replaceQuestionOptions(
      questionId,
      options.map(option => ({
        label: option.label,
        content: option.content,
        isCorrect: option.isCorrect,
      })),
    );
  }

  await recalculateQuizPoints(record.quiz.id);
  return getQuizForEditing(record.quiz.id);
}

export async function deleteQuestion(questionId: string) {
  const { userId } = await requireCurrentUserRole('professor');
  const record = await getQuestionWithQuiz(questionId);

  if (!record) {
    throw new Error('Question not found');
  }

  if (record.quiz.professorId !== userId) {
    throw new Error('Forbidden');
  }

  const question = await deleteQuestionRecord(questionId);
  await recalculateQuizPoints(record.quiz.id);
  return question;
}

export async function reorderQuestions(input: ReorderQuestionsInput) {
  const { userId } = await requireCurrentUserRole('professor');
  const values = reorderQuestionsSchema.parse(input);
  await assertProfessorOwnsQuiz(values.quizId, userId);

  const questions = await getQuestionsByQuizId(values.quizId);
  const existingIds = new Set(questions.map(question => question.id));

  if (
    existingIds.size !== values.questionIds.length ||
    values.questionIds.some(questionId => !existingIds.has(questionId))
  ) {
    throw new Error('Question list does not match this quiz');
  }

  await Promise.all(
    values.questionIds.map((questionId, index) =>
      updateQuestionSequenceNumber(questionId, index + 1),
    ),
  );

  return getQuizForEditing(values.quizId);
}

export async function getProfessorQuizzes() {
  const { userId } = await requireCurrentUserRole('professor');
  return getQuizzesByProfessor(userId);
}

export async function getQuizForEditing(
  quizId: string,
): Promise<QuizForEditing> {
  const { userId } = await requireCurrentUserRole('professor');
  const quiz = await assertProfessorOwnsQuiz(quizId, userId);
  const questions = await toQuestionWithOptions(quizId);

  return {
    ...quiz,
    questions,
  };
}

export async function getAvailableQuizzes() {
  const currentUser = await getCurrentUserWithRole();

  if (currentUser.role === 'professor') {
    return getQuizzesByProfessor(currentUser.userId);
  }

  return getAvailableQuizzesForStudent(currentUser.userId);
}

export async function getClassroomQuizzes(classroomId: string) {
  const currentUser = await getCurrentUserWithRole();

  if (currentUser.role === 'professor') {
    await assertProfessorOwnsClassroom(classroomId, currentUser.userId);
  } else {
    const hasAccess = await checkStudentAccessToClassroom(
      classroomId,
      currentUser.userId,
    );

    if (!hasAccess) {
      throw new Error('Forbidden');
    }
  }

  return getQuizzesByClassroom(classroomId);
}

export async function getQuizForTaking(
  quizId: string,
): Promise<QuizForTaking> {
  const { quiz } = await assertCurrentStudentCanTakeQuiz(quizId);
  const questions = await toQuestionWithOptions(quizId);

  return {
    ...quiz,
    questions: questions.map(question => ({
      ...question,
      options: question.options.map(({ isCorrect, ...option }) => option),
    })),
  };
}

export async function getGeneralQuizzesForCurrentUser() {
  const currentUser = await getCurrentUserWithRole();

  if (currentUser.role === 'professor') {
    return getQuizzesByProfessor(currentUser.userId).then(quizzes =>
      quizzes.filter(quiz => !quiz.classroomId),
    );
  }

  return getGeneralQuizzes();
}
