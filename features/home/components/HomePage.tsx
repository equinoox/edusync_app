"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/providers/ThemeProvider";
import { Loader } from "@/components/shared/loader";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "./TopBar";
import SmallBar from "@/components/layout/SmallBar";
import HeroSection from "./HeroSection";
import ClassroomSection from "./ClassroomSection";

export default function HomePage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { darkMode } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoaded) {
    return <Loader />;
  }

  const displayName = isSignedIn && user ? user.fullName || user.username || "Guest" : "Welcome";
  const firstName = isSignedIn && user ? user.firstName || user.username || "there" : "there";

  return (
    <main className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950" : "bg-slate-300"}`}>
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


      <div className="flex flex-1 flex-col w-full">
        <SmallBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="hidden lg:block">
          <TopBar displayName={displayName} />
        </div>

        <div className="flex flex-col gap-8 p-6">
          <HeroSection firstName={firstName} />
          {/* <ClassroomSection /> */}
        </div>
      </div>
    </main>
  );
}
