"use client";

import type { TopBarProps } from "@/features/home/types";
import { UserAccountSummary } from "@/components/layout/UserAccountSummary";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { useTheme } from "@/providers/ThemeProvider";

export default function TopBar({ displayName }: TopBarProps) {
  const { darkMode } = useTheme();

  return (
    <div className="sticky top-0 z-30 flex justify-end items-center gap-4 px-6 py-1 mt-3  backdrop-blur-sm">
      <div className={`flex items-center gap-4 rounded-2xl px-5 py-3 shadow-sm border ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-500 bg-slate-300"}`}>
        <NotificationBell />
        <div className={`w-px h-6 ${darkMode ? "bg-slate-700" : "bg-slate-500"}`} />
        <UserAccountSummary fallbackName={displayName} />
      </div>
    </div>
  );
}
