'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { ClassroomMaterialsManager } from '@/features/classrooms/components/ClassroomMaterialsManager';
import { ClassroomStudentsManager } from '@/features/classrooms/components/ClassroomStudentsManager';
import { UpcomingPanel } from '@/features/classrooms/components/UpcomingPanel';
import type {
  ClassroomDetails,
  ClassroomDetailsModalProps,
} from '@/features/classrooms/types';
import { useTheme } from '@/providers/ThemeProvider';

export function ClassroomDetailsModal({
  classroom,
  onClose,
  onToast,
  onChanged,
}: ClassroomDetailsModalProps) {
  const { darkMode } = useTheme();
  const [details, setDetails] = useState<ClassroomDetails | null>(null);
  const [isPending, startTransition] = useTransition();
  const classroomId = classroom?.id;

  const loadDetails = useCallback(() => {
    if (!classroomId) return;

    startTransition(async () => {
      const response = await fetch(`/api/classrooms/${classroomId}`, {
        cache: 'no-store',
      });
      const result = await response.json();

      if (!response.ok) {
        onToast(result.error ?? 'Something went wrong', 'error');
        return;
      }

      setDetails(result);
    });
  }, [classroomId, onToast]);

  useEffect(() => {
    if (!classroom) {
      setDetails(null);
      return;
    }

    loadDetails();
  }, [classroomId, classroom, loadDetails]);

  if (!classroom) return null;

  const activeDetails = details;
  const classroomInfo = activeDetails?.classroom ?? classroom;
  const canManage = Boolean(activeDetails?.canManage);
  const isStudent = activeDetails?.viewerRole === 'student';

  const handleChildChanged = useCallback(() => {
    loadDetails();
    onChanged();
  }, [loadDetails, onChanged]);

  const handleUpcomingError = useCallback(
    (message: string) => onToast(message, 'error'),
    [onToast],
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-3 py-6 backdrop-blur-sm edusync-enter-fast">
      <div
        className={`edusync-scale-in flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${
          darkMode
            ? 'border-slate-700 bg-slate-950'
            : 'border-slate-200 bg-slate-100'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className={`relative shrink-0 border-b p-5 text-center ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="mx-auto max-w-2xl">
            <h2 className={`truncate text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              {classroomInfo.title}
            </h2>
            <p className={`mt-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {classroomInfo.description}
            </p>
            <div className={`mt-3 flex flex-wrap items-center justify-center gap-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>{classroomInfo.numberOfStudents} students</span>
              <span className={darkMode ? 'text-slate-700' : 'text-slate-400'}>|</span>
              <span>{activeDetails?.materials.length ?? 0} documents</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`edusync-button-motion absolute right-4 top-4 rounded-lg p-2 transition ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-white'}`}
            aria-label="Close classroom details"
            title="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {isPending && !activeDetails ? (
            <div className={`grid min-h-48 place-items-center rounded-xl border p-8 ${darkMode ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
            </div>
          ) : activeDetails ? (
            <div className="edusync-enter-fast grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="space-y-5">
                <ClassroomMaterialsManager
                  classroomId={activeDetails.classroom.id}
                  canManage={canManage}
                  isStudent={isStudent}
                  materials={activeDetails.materials}
                  onChanged={handleChildChanged}
                  onToast={onToast}
                />
                <UpcomingPanel
                  classroomId={activeDetails.classroom.id}
                  viewerRole={activeDetails.viewerRole}
                  onError={handleUpcomingError}
                />
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
