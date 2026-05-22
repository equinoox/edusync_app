"use client";

import { useEffect, useState } from "react";

import { useTheme } from "@/providers/ThemeProvider";

export type ToastNotificationState = {
  id: number;
  message: string;
  tone?: "success" | "error" | "info";
};

type ToastNotificationProps = {
  toast: ToastNotificationState | null;
  onDismiss: () => void;
  durationMs?: number;
};

const EXIT_ANIMATION_MS = 700;

export function ToastNotification({
  toast,
  onDismiss,
  durationMs = 3200,
}: ToastNotificationProps) {
  const { darkMode } = useTheme();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!toast) {
      return;
    }

    setIsExiting(false);

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, durationMs);

    const dismissTimer = window.setTimeout(() => {
      onDismiss();
    }, durationMs + EXIT_ANIMATION_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [durationMs, onDismiss, toast]);

  if (!toast) return null;

  const toneClassName =
    toast.tone === "error"
      ? "border-red-500 bg-red-600 text-white"
      : toast.tone === "success"
        ? "border-emerald-500 bg-emerald-600 text-white"
        : darkMode
          ? "border-slate-700 bg-slate-900 text-white"
          : "border-gray-200 bg-white text-slate-900";

const animationClassName = isExiting
  ? "opacity-0 translate-y-4 scale-95"
  : "opacity-100 translate-y-0 scale-100";

  return (
    <div className="pointer-events-none fixed left-1/2 bottom-8 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 px-2">
      <div
        className={`pointer-events-auto rounded-lg border px-4 py-3 text-center text-sm font-semibold shadow-xl transition-all duration-700 ease-in-out ${toneClassName} ${animationClassName}`}
        role="status"
        aria-live="polite"
      >
        {toast.message}
      </div>
    </div>
  );
}