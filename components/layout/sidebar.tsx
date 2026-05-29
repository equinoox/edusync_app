"use client";

import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import Link from "next/link";
import SideBarItem from "../shared/sidebar_item";
import { UpgradePlansModal } from "@/components/shared/UpgradePlansModal";
import {
  HomeIcon,
  BuildingLibraryIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

// STATIC FOR NOW - LATER WILL BE DYNAMIC BASED ON USER ROLE AND PERMISSIONS
const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon width="22" height="22" />,
  },
  {
    href: "/classrooms",
    label: "Classrooms",
    icon: <BuildingLibraryIcon width="22" height="22" />,
  },
  {
    href: "/chat",
    label: "AI Assistant",
    icon: <ChatBubbleLeftRightIcon width="22" height="22" />,
  },
  {
    href: "/quizzes",
    label: "Quizzes",
    icon: <ClipboardDocumentListIcon width="22" height="22" />,
  },
  {
    href: "/documents",
    label: "Documents",
    icon: <DocumentTextIcon width="22" height="22" />,
  },
  {
    href: "/progress",
    label: "Progress",
    icon: <ChartBarIcon width="22" height="22" />,
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: <CalendarIcon width="22" height="22" />,
  },
];

export default function Sidebar({ sidebarOpen = true }: { sidebarOpen?: boolean }) {
  const { darkMode, setDarkMode } = useTheme();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  return (
    <aside className={`flex flex-col w-64 min-h-screen sticky top-0 transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-slate-50"} py-6 px-5 ${sidebarOpen ? "flex" : "hidden"} lg:flex`}>
      <UpgradePlansModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      <Link href="/" className="flex items-center gap-2.5 mb-7 group">
        <span className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200 ${darkMode ? "bg-violet-600 hover:bg-violet-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
          </svg>
        </span>
        <span className={`text-2xl font-bold tracking-tight hover:opacity-80 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Edu<span className={darkMode ? "text-violet-600" : "text-indigo-600"}>Sync</span>
        </span>
      </Link>


      <nav className="flex flex-col gap-1 flex-1 mb-6">
        {NAV_ITEMS.map((item) => (
          <SideBarItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </nav>


      <div className="flex flex-col gap-3">

        <div className={`p-3.5 rounded-2xl border transition-colors duration-200 ${darkMode ? "bg-violet-950 border-violet-800" : "bg-indigo-50 border-indigo-100"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-semibold ${darkMode ? "text-violet-200" : "text-indigo-800"}`}>Upgrade to Pro</span>
            <span>👑</span>
          </div>
          <p className={`text-xs leading-relaxed mb-3 ${darkMode ? "text-violet-300" : "text-indigo-600"}`}>
            Unlock more AI messages, larger file uploads, and advanced insights.
          </p>
          <button
            type="button"
            onClick={() => setIsUpgradeModalOpen(true)}
            className={`block w-full text-center text-sm font-semibold text-white transition-colors duration-150 rounded-xl py-2 ${darkMode ? "bg-violet-600 hover:bg-violet-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            Upgrade Now
          </button>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-base font-medium transition-all duration-200 ${darkMode ? "text-violet-200 hover:bg-slate-800 hover:text-violet-100" : "text-slate-600 hover:bg-white hover:text-slate-800"}`}
        >
          <MoonIcon width="20" height="20" className={darkMode ? "text-violet-400" : "text-slate-500"} />
          <span className="flex-1 text-left">Dark Mode</span>
          <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${darkMode ? "bg-violet-600" : "bg-slate-50"}`}>
            <span
              className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200"
              style={{ transform: darkMode ? "translateX(18px)" : "translateX(2px)" }}
            />
          </span>
        </button>
      </div>
    </aside>
  );
}
