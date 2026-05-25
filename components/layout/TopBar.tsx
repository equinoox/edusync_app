"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { useTheme } from "@/providers/ThemeProvider";

type TopBarProps = {
  pageName: string;
  actions?: ReactNode;
};

export default function TopBar({ pageName, actions }: TopBarProps) {
  const { darkMode } = useTheme();

  return (
    <header className={`shrink-0 border-b px-6 py-4 shadow-sm transition-colors duration-300 ${darkMode ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-indigo-800"}`}>
      <div className="flex items-center justify-between gap-3">
        <Link href="/home" className="flex items-center gap-3 transition-opacity hover:opacity-75">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-md ${darkMode ? "bg-violet-600" : "bg-indigo-600"}`}>
            <AcademicCapIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
              <span className="text-white">Edu</span><span className={darkMode ? "text-violet-600" : "text-orange-600"}>Sync</span>
            </div>
            <div className="text-xs font-medium text-gray-100">
              {pageName}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {actions}
          <NotificationBell />
          <div className="scale-125 origin-center">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
