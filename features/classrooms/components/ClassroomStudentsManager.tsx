'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';

import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import {
  addStudentToClassroomAction,
  removeStudentFromClassroomAction,
} from '@/features/classrooms/actions/classrooms.action';
import type {
  ClassroomStudentPendingAction,
  ClassroomStudentsManagerProps,
} from '@/features/classrooms/types';
import { useTheme } from '@/providers/ThemeProvider';

export function ClassroomStudentsManager({
  classroomId,
  canManage,
  students,
  onChanged,
  onToast,
}: ClassroomStudentsManagerProps) {
  const { darkMode } = useTheme();
  const [studentId, setStudentId] = useState('');
  const [pendingAction, setPendingAction] = useState<ClassroomStudentPendingAction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirmAction = async () => {
    if (!pendingAction) return;

    setIsLoading(true);
    const result =
      pendingAction.type === 'add'
        ? await addStudentToClassroomAction({
            classroomId,
            studentId: pendingAction.studentId,
          })
        : await removeStudentFromClassroomAction({
            classroomId,
            studentId: pendingAction.studentId,
          });

    setIsLoading(false);

    if (typeof result === 'string') {
      onToast(result, 'error');
      return;
    }

    setStudentId('');
    setPendingAction(null);
    onToast(
      pendingAction.type === 'add' ? 'Student added' : 'Student removed',
      'success',
    );
    onChanged();
  };

  return (
    <section className={`rounded-xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <ConfirmationModal
        isOpen={Boolean(pendingAction)}
        isLoading={isLoading}
        message={
          pendingAction?.type === 'add'
            ? 'Are you sure you want to add this student?'
            : 'Are you sure you want to remove this student?'
        }
        confirmLabel="Yes"
        loadingLabel="Working..."
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmAction}
      />

      <div className="flex items-center gap-2">
        <UserGroupIcon className={`h-5 w-5 ${darkMode ? 'text-violet-300' : 'text-violet-600'}`} />
        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
          Students
        </h3>
        <span className={`ml-auto text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {students.length}
        </span>
      </div>

      {canManage && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={studentId}
            onChange={event => setStudentId(event.target.value)}
            placeholder="Student ID"
            className={`h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${
              darkMode
                ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500'
                : 'border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400'
            }`}
          />
          <button
            type="button"
            onClick={() => {
              const trimmedStudentId = studentId.trim();
              if (!trimmedStudentId) {
                onToast('Student id is required', 'error');
                return;
              }
              setPendingAction({ type: 'add', studentId: trimmedStudentId });
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            <PlusIcon className="h-4 w-4" />
            Add
          </button>
        </div>
      )}

      <div className={`mt-4 divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
        {students.length === 0 ? (
          <p className={`py-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            No students enrolled yet.
          </p>
        ) : (
          students.map(student => (
            <div key={student.id} className="flex items-center gap-3 py-3">
              {student.profile?.imageUrl ? (
                <img
                  src={student.profile.imageUrl}
                  alt={student.profile.fullName ?? student.studentId}
                  className="h-9 w-9 rounded-lg object-cover"
                />
              ) : (
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${darkMode ? 'bg-slate-800 text-violet-300' : 'bg-violet-50 text-violet-700'}`}>
                  {(student.profile?.fullName ?? student.studentId).slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  {student.profile?.fullName ?? student.studentId}
                </p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {student.profile?.email ?? student.studentId}
                </p>
              </div>
              {canManage && (
                <button
                  type="button"
                  onClick={() =>
                    setPendingAction({
                      type: 'remove',
                      studentId: student.studentId,
                    })
                  }
                  className={`rounded-lg p-2 transition ${darkMode ? 'text-red-200 hover:bg-red-950' : 'text-red-600 hover:bg-red-50'}`}
                  aria-label={`Remove ${student.studentId}`}
                  title="Remove student"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
