"use client";

import { useTheme } from "@/providers/ThemeProvider";

type ConfirmationModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationModal({
  isOpen,
  isLoading = false,
  message,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4">
      <div
        className={`w-full max-w-sm rounded-lg border p-5 shadow-xl ${
          darkMode
            ? "border-slate-700 bg-slate-900 text-white"
            : "border-gray-200 bg-white text-slate-900"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <p className="text-base font-semibold">{message}</p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              darkMode
                ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                : "bg-gray-100 text-slate-800 hover:bg-gray-200"
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex h-9 items-center rounded-md bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Deleting..." : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
}
