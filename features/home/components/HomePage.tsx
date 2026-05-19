"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/providers/ThemeProvider";
import { Loader } from "@/components/shared/loader";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "./TopBar";
import HeroSection from "./HeroSection";
import { Bars3Icon, XMarkIcon, BellIcon } from "@heroicons/react/24/outline";
import { UserButton } from "@clerk/nextjs";
import ClassroomSection from "./ClassroomSection";

export default function HomePage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { darkMode } = useTheme();

  const [showLoader, setShowLoader] = useState(false);
  const [canShowPage, setCanShowPage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      sessionStorage.removeItem("home-loader-shown");
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setCanShowPage(true);
      return;
    }

    const loaderAlreadyShown = sessionStorage.getItem("home-loader-shown");

    if (loaderAlreadyShown) {
      setCanShowPage(true);
      return;
    }

    sessionStorage.setItem("home-loader-shown", "true");
    setShowLoader(true);

    const timer = setTimeout(() => {
      setShowLoader(false);
      setCanShowPage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn]);

  if (!canShowPage || showLoader) {
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
        <div className={`sticky top-0 z-40 lg:hidden flex items-center justify-between p-4 border-b transition-colors duration-300 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
          <span className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            Edu<span className={darkMode ? "text-violet-600" : "text-indigo-600"}>Sync</span>
          </span>
          <div className="flex items-center gap-3">
            <button className={`p-2 rounded-lg transition-colors relative flex-shrink-0 ${darkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}>
              <BellIcon className={`w-5 h-5 ${darkMode ? "text-violet-400" : "text-slate-600"}`} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white" />
            </button>
            <div className="scale-125 origin-center flex-shrink-0">
              <UserButton />
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
            >
              {sidebarOpen ? (
                <XMarkIcon className={`w-6 h-6 ${darkMode ? "text-violet-400" : "text-slate-600"}`} />
              ) : (
                <Bars3Icon className={`w-6 h-6 ${darkMode ? "text-violet-400" : "text-slate-600"}`} />
              )}
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <TopBar displayName={displayName} />
        </div>

        <div className="flex flex-col gap-8 p-6">
          <HeroSection firstName={firstName} />
          <ClassroomSection />
        </div>
      </div>
    </main>
  );
}
