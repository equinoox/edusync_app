'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { useTheme } from '@/providers/ThemeProvider';

type UpgradePlansModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    benefits: ['Core classrooms', 'Basic quizzes', 'Limited AI messages'],
  },
  {
    name: 'Pro',
    price: 'Coming soon',
    highlighted: true,
    benefits: [
      'More AI messages',
      'More document uploads',
      'AI insights',
      'Advanced progress tracking',
    ],
  },
  {
    name: 'Professor / Team',
    price: 'Coming soon',
    benefits: ['Classroom analytics', 'Team management', 'Priority features'],
  },
];

export function UpgradePlansModal({ isOpen, onClose }: UpgradePlansModalProps) {
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm edusync-enter-fast"
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`edusync-scale-in w-full max-w-4xl overflow-hidden rounded-2xl border shadow-2xl ${
          darkMode
            ? 'border-slate-700 bg-slate-950 text-white shadow-black/40'
            : 'border-slate-200 bg-white text-slate-950 shadow-slate-950/20'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-plans-title"
      >
        <div className={`flex items-start justify-between gap-4 border-b px-5 py-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div>
            <h2 id="upgrade-plans-title" className="text-xl font-bold">
              Upgrade your EduSync experience
            </h2>
            <p className={`mt-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Pro features are coming soon. Here is what EduSync plans will unlock.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 transition ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
            aria-label="Close upgrade plans"
            title="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 p-5 md:grid-cols-3">
          {plans.map(plan => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-4 transition ${
                plan.highlighted
                  ? darkMode
                    ? 'border-violet-500/50 bg-violet-950/50'
                    : 'border-indigo-300 bg-indigo-50'
                  : darkMode
                    ? 'border-slate-800 bg-slate-900'
                    : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{plan.name}</h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {plan.price}
                  </p>
                </div>
                {plan.highlighted && (
                  <span className="rounded-full bg-violet-600 px-2 py-1 text-[11px] font-bold text-white">
                    Popular
                  </span>
                )}
              </div>

              <ul className={`mt-4 space-y-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {plan.benefits.map(benefit => (
                  <li key={benefit} className="flex gap-2">
                    <span className={darkMode ? 'text-violet-300' : 'text-indigo-600'}>-</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled
                className={`mt-5 h-9 w-full rounded-xl text-sm font-semibold ${
                  plan.highlighted
                    ? 'bg-violet-600 text-white opacity-80'
                    : darkMode
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-200 text-slate-500'
                }`}
              >
                Coming soon
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
