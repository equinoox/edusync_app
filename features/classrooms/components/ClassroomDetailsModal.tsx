'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { getClassroomDetailsAction } from '@/features/classrooms/actions/classrooms.action';
import { ClassroomMaterialsManager } from '@/features/classrooms/components/ClassroomMaterialsManager';
import { ClassroomStudentsManager } from '@/features/classrooms/components/ClassroomStudentsManager';
import type {
  ClassroomDetails,
  ClassroomListItem,
} from '@/features/classrooms/types';
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
  const [isPending, startTransition] = useTransition();

  const loadDetails = useCallback(() => {
    if (!classroom) return;

    startTransition(async () => {
      const result = await getClassroomDetailsAction(classroom.id);

      if (typeof result === 'string') {
        onToast(result, 'error');
        onClose();
        return;
      }

      setDetails(result);
      onChanged();
    });
  }, [classroom, onChanged, onClose, onToast]);

  useEffect(() => {
    if (!classroom) {
      setDetails(null);
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
              <ClassroomMaterialsManager
                classroomId={activeDetails.classroom.id}
                canManage={canManage}
                isStudent={isStudent}
                materials={activeDetails.materials}
                onChanged={handleChildChanged}
                onToast={onToast}
              />
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
