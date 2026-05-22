"use client";

import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useTheme } from "@/providers/ThemeProvider";

type SmallBarProps = {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  actions?: ReactNode;
  showNotifications?: boolean;
};

export default function SmallBar({
  sidebarOpen,
  onToggleSidebar,
  actions,
  showNotifications = true,
}: SmallBarProps) {
  const { darkMode } = useTheme();

  return (
    <div className={`sticky top-0 z-40 flex items-center justify-between border-b p-4 transition-colors duration-300 lg:hidden ${darkMode ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"}`}>
      <span className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
        Edu<span className={darkMode ? "text-violet-600" : "text-indigo-600"}>Sync</span>
      </span>

      <div className="flex items-center gap-3">
        {actions}

        {showNotifications && (
          <button
            type="button"
            className={`relative flex-shrink-0 rounded-lg p-2 transition-colors ${darkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
            aria-label="Notifications"
            title="Notifications"
          >
            <BellIcon className={`h-5 w-5 ${darkMode ? "text-violet-400" : "text-slate-600"}`} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-indigo-500" />
          </button>
        )}

        <div className="scale-125 origin-center flex-shrink-0">
          <UserButton />
        </div>

        <button
          type="button"
          onClick={onToggleSidebar}
          className={`rounded-lg p-2 transition-colors ${darkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <XMarkIcon className={`h-6 w-6 ${darkMode ? "text-violet-400" : "text-slate-600"}`} />
          ) : (
            <Bars3Icon className={`h-6 w-6 ${darkMode ? "text-violet-400" : "text-slate-600"}`} />
          )}
        </button>
      </div>
    </div>
  );
}
