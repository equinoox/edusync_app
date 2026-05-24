'use client';

import { useRef, useState } from 'react';
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import {
  addClassroomMaterialAction,
  copyClassroomMaterialToMyDocumentsAction,
  deleteClassroomMaterialAction,
} from '@/features/classrooms/actions/classroom-materials.action';
import { CopyClassroomMaterialButton } from '@/features/classrooms/components/CopyClassroomMaterialButton';
import type { ClassroomMaterial } from '@/features/classrooms/types';
import { useTheme } from '@/providers/ThemeProvider';

type ClassroomMaterialsManagerProps = {
  classroomId: string;
  canManage: boolean;
  isStudent: boolean;
  materials: ClassroomMaterial[];
  onChanged: () => void;
  onToast: (message: string, tone?: 'success' | 'error' | 'info') => void;
};

type PendingAction =
  | { type: 'add'; file: File }
  | { type: 'delete'; material: ClassroomMaterial };

const materialFileNamePattern = /^\d+_[A-Za-z0-9-]+_[A-Za-z0-9-]+\.pdf$/i;

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function ClassroomMaterialsManager({
  classroomId,
  canManage,
  isStudent,
  materials,
  onChanged,
  onToast,
}: ClassroomMaterialsManagerProps) {
  const { darkMode } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      onToast('Only PDF files are supported', 'error');
      return false;
    }

    if (!materialFileNamePattern.test(file.name)) {
      onToast('Document name must use this format: 01_Math_Algebra.pdf', 'error');
      return false;
    }

    return true;
  };

  const confirmAction = async () => {
    if (!pendingAction) return;

    setLoadingAction(pendingAction.type);

    const result =
      pendingAction.type === 'add'
        ? await addMaterial(pendingAction.file)
        : await deleteClassroomMaterialAction(pendingAction.material.id);

    setLoadingAction(null);

    if (typeof result === 'string') {
      onToast(result, 'error');
      return;
    }

    setPendingAction(null);
    onToast(
      pendingAction.type === 'add' ? 'Document added' : 'Document deleted',
      'success',
    );
    onChanged();
  };

  const addMaterial = (file: File) => {
    const formData = new FormData();
    formData.append('classroomId', classroomId);
    formData.append('file', file);
    return addClassroomMaterialAction(formData);
  };

  const copyMaterial = async (material: ClassroomMaterial) => {
    setLoadingAction(material.id);
    const result = await copyClassroomMaterialToMyDocumentsAction({
      materialId: material.id,
    });
    setLoadingAction(null);

    if (typeof result === 'string') {
      onToast(result, 'error');
      return;
    }

    window.dispatchEvent(
      new CustomEvent('edusync:documents-changed', {
        detail: { uploadedDocuments: [result] },
      }),
    );
    onToast('Document transferred to your Documents', 'success');
  };

  return (
    <section className={`rounded-xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <ConfirmationModal
        isOpen={Boolean(pendingAction)}
        isLoading={Boolean(loadingAction)}
        message={
          pendingAction?.type === 'add'
            ? 'Are you sure you want to add this file?'
            : 'Are you sure you want to delete this file?'
        }
        confirmLabel="Yes"
        loadingLabel="Working..."
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmAction}
      />

      <div className="flex items-center gap-2">
        <DocumentTextIcon className={`h-5 w-5 ${darkMode ? 'text-violet-300' : 'text-violet-600'}`} />
        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
          Documents
        </h3>
        <span className={`ml-auto text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {materials.length}
        </span>
      </div>

      {canManage && (
        <div className={`mt-4 rounded-lg border border-dashed p-3 ${darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={event => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = '';

              if (!file || !validateFile(file)) return;
              setPendingAction({ type: 'add', file });
            }}
          />
          <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Document name must use this format: [serial number]_[subject]_[area]
            <br />
            Example: 01_Math_Algebra.pdf
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-3 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            <DocumentArrowUpIcon className="h-5 w-5" />
            Add PDF
          </button>
        </div>
      )}

      <div className={`mt-4 divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
        {materials.length === 0 ? (
          <p className={`py-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            No documents added yet.
          </p>
        ) : (
          materials.map(material => (
            <div key={material.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  {material.fileName}
                </p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {formatFileSize(material.size)} - {new Date(material.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center rounded-lg bg-violet-600 px-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Open PDF
                </a>
                {isStudent && (
                  <CopyClassroomMaterialButton
                    isLoading={loadingAction === material.id}
                    onCopy={() => copyMaterial(material)}
                  />
                )}
                {canManage && (
                  <button
                    type="button"
                    onClick={() => setPendingAction({ type: 'delete', material })}
                    disabled={loadingAction === material.id}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      darkMode
                        ? 'bg-red-950 text-red-100 hover:bg-red-900'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
