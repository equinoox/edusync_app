"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowUpTrayIcon,
  BoltIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import type { UserRole } from "@/features/auth/types";

type HomeQuickActionsProps = {
  role?: UserRole | null;
};

type HomeQuickAction = {
  id: string;
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
};

export default function HomeQuickActions({ role }: HomeQuickActionsProps) {
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
    <aside className="edusync-enter edusync-card-motion relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(124,58,237,0.2),transparent_34%)]" />

      <div className="relative">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300">
            <BoltIcon className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>
        </div>

        <div className="space-y-3">
          {actions.map(({ id, label, href, Icon }) => (
            <Link
              key={id}
              href={href}
              className="edusync-button-motion group flex w-full items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-950/45 p-4 text-left transition hover:border-violet-400/50 hover:bg-slate-950/70"
            >
              <span className="text-sm font-semibold text-slate-100">{label}</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white shadow-lg shadow-violet-950/40 transition group-hover:bg-orange-500">
                <Icon className="h-5 w-5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
