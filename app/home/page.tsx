"use client";

import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useTheme } from "@/providers/ThemeProvider";
import { Loader } from "@/components/shared/loader";
import Sidebar from "@/components/shared/sidebar";
import ClassroomCard from "@/components/ui/card";
import Link from "next/link";
import {
  BellIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CalculatorIcon,
  BeakerIcon,
  CodeBracketIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

const CLASSROOMS = [
  {
    name: "Mathematics",
    topics: "Algebra, Calculus, Geometry and more",
    quizCount: 12,
    progress: 85,
    icon: <CalculatorIcon width={20} height={20} />,
  },
  {
    name: "Physics",
    topics: "Mechanics, Thermodynamics, Electromagnetism",
    quizCount: 8,
    progress: 72,
    icon: <BeakerIcon width={20} height={20} />,
  },
  {
    name: "Computer Science",
    topics: "Data Structures, Algorithms, Programming",
    quizCount: 10,
    progress: 90,
    icon: <CodeBracketIcon width={20} height={20} />,
  },
  {
    name: "English",
    topics: "Vocabulary, Grammar, Comprehension",
    quizCount: 6,
    progress: 78,
    icon: <BookOpenIcon width={20} height={20} />,
  },
];

const FEATURES = [
  {
    title: "Upload & Learn",
    desc: "Upload PDFs and get clear explanations from AI.",
    bg: "bg-violet-50",
    color: "text-violet-600",
    icon: <DocumentTextIcon width={18} height={18} />,
  },
  {
    title: "AI Assistant",
    desc: "Ask questions, get answers, and learn concepts deeply.",
    bg: "bg-blue-50",
    color: "text-blue-500",
    icon: <ChatBubbleLeftRightIcon width={18} height={18} />,
  },
  {
    title: "Quizzes",
    desc: "Test your knowledge with custom quizzes.",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    icon: <ClipboardDocumentListIcon width={18} height={18} />,
  },
  {
    title: "Track Progress",
    desc: "Monitor your learning journey and improve every day.",
    bg: "bg-amber-50",
    color: "text-amber-500",
    icon: <ChartBarIcon width={18} height={18} />,
  },
];

export default function HomePage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { darkMode } = useTheme();

  const [showLoader, setShowLoader] = useState(false);
  const [canShowPage, setCanShowPage] = useState(false);

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

  const firstName = isSignedIn && user
    ? user.firstName || user.username || "there"
    : "there";

  return (
    <main className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950" : "bg-gray-50"}`}>
      <Sidebar />

      <div className="flex flex-1 flex-col">

        {/* Top bar */}
        <div className="flex justify-end items-center gap-4 px-6 py-2 mt-6">
          <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative flex-shrink-0">
              <BellIcon className="w-6 h-6 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white" />
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div className="scale-150 mt-2 origin-center flex-shrink-0">
              <UserButton />
            </div>
            <div className="flex-shrink-0 min-w-max">
              <p className="text-lg font-semibold text-slate-800">
                {isSignedIn && user ? `${user.fullName || user.username || "Guest"}` : "Welcome"}
              </p>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex flex-col gap-8 p-6">

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gray-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-gray-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex-1 z-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 tracking-tight">
                Master any subject<br />
                with <span className="text-violet-600">EduSync</span>
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-sm">
                Upload your study materials and chat with our AI assistant to understand, practice, and excel.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/ai-assistant" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-violet-200">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Chat with AI Assistant
                </Link>
                <Link href="/documents" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold border border-gray-200 transition-colors">
                  <ArrowUpTrayIcon className="w-4 h-4" />
                  Upload PDF
                </Link>
              </div>
            </div>

            {/* AI chat card */}
            <div className="relative z-10 w-full md:w-72 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-violet-100/60 border border-white p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                  AI
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">EduSync AI</p>
                  <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Online
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl rounded-tl-sm p-3">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Hi {firstName}! 👋 Upload your notes or a PDF and Ill help you understand the topic step by step.
                </p>
              </div>
              <div className="bg-violet-600 rounded-xl rounded-tr-sm p-3 self-end max-w-[90%]">
                <p className="text-xs text-white leading-relaxed">
                  Can you explain integration by parts in simple terms?
                </p>
              </div>
              <div className="flex items-center gap-1 px-1 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>

          {/* Classrooms */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Your Classrooms</h2>
              <Link href="/classrooms" className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {CLASSROOMS.map((c) => (
                <ClassroomCard key={c.name} {...c} />
              ))}
            </div>
          </section>

          {/* TODO QUIZES!!! */}


        </div>
      </div>
    </main>
  );
}