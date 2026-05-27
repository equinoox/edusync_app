"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/providers/ThemeProvider";
import { Loader } from "@/components/shared/loader";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "./TopBar";
import SmallBar from "@/components/layout/SmallBar";
import HeroSection from "./HeroSection";
import HomeNewsSlider from "./HomeNewsSlider";
import StudyStreakCard from "./StudyStreakCard";
import HomeQuickActions from "./HomeQuickActions";
import { isUserRole } from "@/features/auth/types";

export default function HomePage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { darkMode } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoaded) {
    return <Loader />;
  }

  const displayName = isSignedIn && user ? user.fullName || user.username || "Guest" : "Welcome";
  const firstName = isSignedIn && user ? user.firstName || user.username || "there" : "there";
  const rawRole = user?.publicMetadata?.role;
  const role = isUserRole(rawRole) ? rawRole : null;

  return (
    <main className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950" : "bg-slate-200"}`}>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>


      <div className="flex min-w-0 flex-1 flex-col">
        <SmallBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="hidden lg:block">
          <TopBar displayName={displayName} />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-3 sm:p-4 lg:p-5">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/20 sm:p-5">
            <HeroSection firstName={firstName} />
            <HomeNewsSlider />
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
              <StudyStreakCard />
              <HomeQuickActions role={role} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
