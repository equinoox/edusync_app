"use client";

import Link from "next/link";
import {
  ArrowUpTrayIcon,
  BoltIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import type { HomeQuickAction, HomeQuickActionsProps } from "@/features/home/types";
import { useTheme } from "@/providers/ThemeProvider";

export default function HomeQuickActions({ role }: HomeQuickActionsProps) {
  const { darkMode } = useTheme();
  const isProfessor = role === "professor";
  const actions: HomeQuickAction[] = isProfessor
    ? [
        {
          id: "create-classroom",
          label: "Create Classroom",
          href: "/classrooms",
          Icon: BuildingLibraryIcon,
        },
        {
          id: "create-quiz",
          label: "Create Quiz",
          href: "/quizzes",
          Icon: ClipboardDocumentListIcon,
        },
      ]
    : [
        {
          id: "upload-pdf",
          label: "Upload PDF",
          href: "/documents",
          Icon: ArrowUpTrayIcon,
        },
        {
          id: "start-quiz",
          label: "Start Quiz",
          href: "/quizzes",
          Icon: ClipboardDocumentListIcon,
        },
      ];

  return (
    <aside className={`edusync-enter edusync-card-motion relative overflow-hidden rounded-2xl border p-4 shadow-2xl ${darkMode ? 'border-white/10 bg-slate-900/80 shadow-slate-950/30' : 'border-slate-200 bg-white shadow-slate-200/70'}`}>
      <div className={`pointer-events-none absolute inset-0 ${darkMode ? 'bg-[radial-gradient(circle_at_100%_0%,rgba(124,58,237,0.2),transparent_34%)]' : 'bg-[radial-gradient(circle_at_100%_0%,rgba(79,70,229,0.08),transparent_34%)]'}`} />

      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${darkMode ? 'bg-violet-600/20 text-violet-300' : 'bg-indigo-50 text-indigo-600'}`}>
            <BoltIcon className="h-5 w-5" />
          </span>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h2>
        </div>

        <div className="space-y-3">
          {actions.map(({ id, label, href, Icon }) => (
            <Link
              key={id}
              href={href}
              className={`edusync-button-motion group flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition hover:border-violet-400/50 ${darkMode ? 'border-white/5 bg-slate-950/45 hover:bg-slate-950/70' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
            >
              <span className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{label}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white shadow-lg shadow-violet-950/40 transition group-hover:bg-orange-500">
                <Icon className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
