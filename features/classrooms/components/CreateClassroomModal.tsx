'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  classroomColorOptions,
  classroomIconOptions,
} from '@/features/classrooms/components/classroom-ui';
import type { CreateClassroomInput } from '@/features/classrooms/types';
import type {
  ClassroomColor,
  ClassroomIcon,
} from '@/features/classrooms/options';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';

type CreateClassroomModalProps = {
  isOpen: boolean;
  isSaving: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (input: CreateClassroomInput) => void;
};

const defaultFormState: CreateClassroomInput = {
  title: '',
  description: '',
  icon: 'building',
  color: 'violet',
};

export function CreateClassroomModal({
  isOpen,
  isSaving,
  error,
  onClose,
  onSubmit,
}: CreateClassroomModalProps) {
  const { darkMode } = useTheme();
  const [formState, setFormState] = useState<CreateClassroomInput>(defaultFormState);

  useEffect(() => {
    if (isOpen) {
      setFormState(defaultFormState);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...formState,
      title: formState.title.trim(),
      description: formState.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm edusync-enter-fast">
      <form
        onSubmit={handleSubmit}
        className={`edusync-scale-in w-full max-w-xl overflow-hidden rounded-lg border shadow-2xl ${darkMode ? "border-slate-700 bg-slate-900 shadow-black/40" : "border-slate-200 bg-white shadow-slate-950/20"}`}
      >
        <div className={`flex items-center justify-between border-b px-5 py-4 ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
          <div>
            <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-950"}`}>
              Create Classroom
            </h2>
            <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
              Set the name, icon, and color.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`edusync-button-motion rounded-lg p-2 text-slate-400 transition ${darkMode ? "hover:bg-slate-800 hover:text-slate-200" : "hover:bg-slate-100 hover:text-slate-700"}`}
            aria-label="Close create classroom modal"
            title="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <label className="block">
            <span className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
              Title
            </span>
            <Input
              value={formState.title}
              onChange={event =>
                setFormState(previous => ({
                  ...previous,
                  title: event.target.value,
                }))
              }
              placeholder="Mathematics 101"
              className={`placeholder:text-slate-400 focus-visible:ring-violet-500 ${darkMode ? "border-slate-700 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-950"}`}
              maxLength={255}
              required
            />
          </label>

          <label className="block">
            <span className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
              Description
            </span>
            <textarea
              value={formState.description}
              onChange={event =>
                setFormState(previous => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
              placeholder="Calculus and Algebra"
              className={`min-h-24 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 ${darkMode ? "border-slate-700 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-950"}`}
              maxLength={2000}
              required
            />
          </label>

          <div>
            <p className={`mb-2 text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
              Color
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {classroomColorOptions.map(option => {
                const selected = formState.color === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormState(previous => ({
                        ...previous,
                        color: option.value as ClassroomColor,
                      }))
                    }
                    className={cn(
                      'edusync-button-motion flex h-12 items-center justify-center rounded-lg border text-sm font-medium transition',
                      selected
                        ? `${option.borderClass} ring-2 ring-violet-500 ${darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-950"}`
                        : darkMode
                          ? 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                    )}
                    aria-label={`Select ${option.label}`}
                    title={option.label}
                  >
                    <span className={cn('h-5 w-5 rounded-full', option.swatchClass)} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className={`mb-2 text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
              Icon
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {classroomIconOptions.map(option => {
                const selected = formState.icon === option.value;
                const Icon = option.Icon;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormState(previous => ({
                        ...previous,
                        icon: option.value as ClassroomIcon,
                      }))
                    }
                    className={cn(
                      'edusync-button-motion flex h-12 items-center justify-center rounded-lg border transition',
                      selected
                        ? `border-violet-500 ring-2 ring-violet-500 ${darkMode ? "bg-violet-500/15 text-violet-200" : "bg-violet-50 text-violet-600"}`
                        : darkMode
                          ? 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50',
                    )}
                    aria-label={`Select ${option.label}`}
                    title={option.label}
                  >
                    <Icon className="h-6 w-6" />
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className={`rounded-lg border px-3 py-2 text-sm ${darkMode ? "border-red-900/60 bg-red-950/50 text-red-200" : "border-red-200 bg-red-50 text-red-700"}`}>
              {error}
            </p>
          )}
        </div>

        <div className={`flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
            className={darkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-violet-600 text-white hover:bg-violet-700"
          >
            {isSaving ? 'Creating...' : 'Create Classroom'}
          </Button>
        </div>
      </form>
    </div>
  );
}
