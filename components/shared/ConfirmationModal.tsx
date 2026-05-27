"use client";

import { useTheme } from "@/providers/ThemeProvider";

type ConfirmationModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  loadingLabel?: string;
};

export function ConfirmationModal({
  isOpen,
  isLoading = false,
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Yes",
  loadingLabel = "Deleting...",
}: ConfirmationModalProps) {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4 edusync-enter-fast">
      <div
        className={`w-full max-w-sm rounded-lg border p-5 shadow-xl edusync-scale-in ${
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
            className={`edusync-button-motion inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
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
            className="edusync-button-motion inline-flex h-9 items-center rounded-md bg-orange-500 px-4 text-sm font-medium text-black transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
