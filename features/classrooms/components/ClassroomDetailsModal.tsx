'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { ClipboardDocumentListIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { ClassroomMaterialsManager } from '@/features/classrooms/components/ClassroomMaterialsManager';
import { ClassroomStudentsManager } from '@/features/classrooms/components/ClassroomStudentsManager';
import type {
  ClassroomDetails,
  ClassroomListItem,
} from '@/features/classrooms/types';
import type { QuizListItem } from '@/features/quizzes/types';
import { useTheme } from '@/providers/ThemeProvider';

type ClassroomDetailsModalProps = {
  classroom: ClassroomListItem | null;
  onClose: () => void;
  onToast: (message: string, tone?: 'success' | 'error' | 'info') => void;
  onChanged: () => void;
};

export function ClassroomDetailsModal({
  classroom,
  onClose,
  onToast,
  onChanged,
}: ClassroomDetailsModalProps) {
  const { darkMode } = useTheme();
  const [details, setDetails] = useState<ClassroomDetails | null>(null);
  const [classroomQuizzes, setClassroomQuizzes] = useState<QuizListItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadDetails = useCallback(() => {
    if (!classroom) return;

    startTransition(async () => {
      const [response, quizzesResponse] = await Promise.all([
        fetch(`/api/classrooms/${classroom.id}`),
        fetch(`/api/classrooms/${classroom.id}/quizzes`),
      ]);
      const result = await response.json();
      const quizzesResult = await quizzesResponse.json();

      if (!response.ok) {
        onToast(result.error ?? 'Something went wrong', 'error');
        onClose();
        return;
      }

      setDetails(result);
      setClassroomQuizzes(quizzesResponse.ok ? quizzesResult : []);
    });
  }, [classroom, onClose, onToast]);

  useEffect(() => {
    if (!classroom) {
      setDetails(null);
      setClassroomQuizzes([]);
      return;
    }

    loadDetails();
  }, [classroom, loadDetails]);

  if (!classroom) return null;

  const activeDetails = details;
  const classroomInfo = activeDetails?.classroom ?? classroom;
  const canManage = Boolean(activeDetails?.canManage);
  const isStudent = activeDetails?.viewerRole === 'student';

  const handleChildChanged = () => {
    loadDetails();
    onChanged();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-3 py-6 backdrop-blur-sm">
      <div
        className={`flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${
          darkMode
            ? 'border-slate-700 bg-slate-950'
            : 'border-slate-200 bg-slate-100'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className={`flex shrink-0 items-start justify-between gap-4 border-b p-5 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="min-w-0">
            <h2 className={`truncate text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              {classroomInfo.title}
            </h2>
            <p className={`mt-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {classroomInfo.description}
            </p>
            <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {classroomInfo.numberOfStudents} students - {activeDetails?.materials.length ?? 0} documents
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 transition ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-white'}`}
            aria-label="Close classroom details"
            title="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {isPending && !activeDetails ? (
            <div className={`rounded-xl border p-8 text-center ${darkMode ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
              Loading classroom...
            </div>
          ) : activeDetails ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="space-y-5">
                <ClassroomMaterialsManager
                  classroomId={activeDetails.classroom.id}
                  canManage={canManage}
                  isStudent={isStudent}
                  materials={activeDetails.materials}
                  onChanged={handleChildChanged}
                  onToast={onToast}
                />
                <section className={`rounded-xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-center gap-2">
                    <ClipboardDocumentListIcon className={`h-5 w-5 ${darkMode ? 'text-violet-300' : 'text-violet-600'}`} />
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                      Quizzes
                    </h3>
                    <span className={`ml-auto text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {classroomQuizzes.length}
                    </span>
                  </div>

                  <div className={`mt-4 divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {classroomQuizzes.length === 0 ? (
                      <p className={`py-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        No quizzes attached to this classroom yet.
                      </p>
                    ) : (
                      classroomQuizzes.map(quiz => (
                        <div key={quiz.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
                          <div className="min-w-0 flex-1">
                            <p className={`truncate text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                              {quiz.title}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                              {quiz.totalPoints} pts - {quiz.timeLimitMinutes} min
                            </p>
                          </div>
                          <Link
                            href={`/quizzes?${isStudent ? 'take' : 'quizId'}=${quiz.id}`}
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-violet-600 px-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                          >
                            {isStudent ? 'Take Quiz' : 'Manage Quiz'}
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
              <ClassroomStudentsManager
                classroomId={activeDetails.classroom.id}
                canManage={canManage}
                students={activeDetails.students}
                onChanged={handleChildChanged}
                onToast={onToast}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
