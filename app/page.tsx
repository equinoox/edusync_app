"use client";

import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import "@/styles/landing.css";
import {
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  LightBulbIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  TrophyIcon,
  UserGroupIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function EduSyncLanding() {
  return (
    <div className="min-h-screen bg-[#F0EEFF] font-sans overflow-hidden">
      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-4 sm:px-10 py-5 anim-fade-up delay-0">
        <div className="flex items-center gap-2">
          <div className="w-8 sm:w-9 h-8 sm:h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <AcademicCapIcon className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <span className="text-lg sm:text-2xl font-bold text-slate-800">
            Edu<span className="text-indigo-600">Sync</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <span className="text-slate-500 hidden sm:inline">Already have an account?</span>
          <button className="px-3 sm:px-5 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-200 text-xs sm:text-sm">
            Sign In
          </button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="px-4 sm:px-10 pt-6 sm:pt-10 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 sm:gap-6">

          <div className="anim-fade-up delay-1">
            <div className="badge-pill">
              <SparklesIcon className="badge-icon" />
              <span className="badge-text">AI-Powered Learning</span>
            </div>
          </div>

          <div className="anim-fade-up delay-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              Welcome to
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-indigo-600 leading-tight">
              EduSync
            </h1>
          </div>

          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-md anim-fade-up delay-3">
            Your AI learning partner that helps you understand any subject, ace
            quizzes, and achieve more.
          </p>

          <div className="flex flex-col gap-4">
            {[
              {
                icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-500" />,
                title: "Chat with AI Assistant",
                desc: "Upload your materials and get clear, step-by-step explanations.",
                bg: "bg-white",
                delay: "delay-4",
              },
              {
                icon: <BookOpenIcon className="w-5 h-5 text-blue-500" />,
                title: "Create Classrooms",
                desc: "Organize subjects, materials, and quizzes in your own learning spaces.",
                bg: "bg-white",
                delay: "delay-5",
              },
              {
                icon: <ClipboardDocumentListIcon className="w-5 h-5 text-green-500" />,
                title: "Take Quizzes",
                desc: "Test your knowledge with customized quizzes and track your progress.",
                bg: "bg-white",
                delay: "delay-6",
              },
              {
                icon: <ChartBarIcon className="w-5 h-5 text-orange-500" />,
                title: "Track Your Progress",
                desc: "Stay motivated by tracking your learning journey and improving every day.",
                bg: "bg-white",
                delay: "delay-7",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`flex items-start gap-4 anim-fade-up ${item.delay}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-2 anim-fade-up delay-8">
            <SignInButton mode="modal" forceRedirectUrl="/home">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 text-sm sm:text-base">
                Get Started
              </button>
            </SignInButton>
            <span className="text-slate-400 text-xs sm:text-sm">No credit card required</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center h-[300px] sm:h-[400px] lg:h-[520px] anim-fade-in delay-panel">
          <div className="hero-glow" />

          <div className="absolute top-10 left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 z-10"
               style={{ animation: "float 3s ease-in-out infinite" }}>
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <CloudArrowUpIcon className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Upload</p>
              <p className="text-slate-400 text-xs">your study materials</p>
            </div>
          </div>

          <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 z-10"
               style={{ animation: "float 3.5s ease-in-out 0.5s infinite" }}>
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
              <LightBulbIcon className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Understand</p>
              <p className="text-slate-400 text-xs">any topic deeply</p>
            </div>
          </div>

          <div className="absolute top-[45%] right-0 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 z-10"
               style={{ animation: "float 4s ease-in-out 1s infinite" }}>
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
              <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Get instant</p>
              <p className="text-slate-400 text-xs">explanations</p>
            </div>
          </div>

          <div className="absolute bottom-12 right-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 z-10"
               style={{ animation: "float 3.2s ease-in-out 1.5s infinite" }}>
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Learn, practice</p>
              <p className="text-slate-400 text-xs">and excel!</p>
            </div>
          </div>

          <div className="relative w-full h-full">
            <Image
              src="/hero_img.png"
              alt="Welcome"
              width={1400}
              height={800}
              className="w-full h-full object-contain hover:scale-110 transition-transform duration-500 relative z-20"
              priority
            />
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-12 bg-black/10 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-10 pb-12 anim-fade-up delay-9">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/60 grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
          {[
            {
              icon: <UserGroupIcon className="w-6 h-6 text-indigo-500" />,
              value: "10K+",
              label: "Active Students",
              bg: "bg-indigo-50",
            },
            {
              icon: <BookOpenIcon className="w-6 h-6 text-green-500" />,
              value: "2K+",
              label: "Classrooms Created",
              bg: "bg-green-50",
            },
            {
              icon: <DocumentTextIcon className="w-6 h-6 text-orange-500" />,
              value: "50K+",
              label: "PDFs Uploaded",
              bg: "bg-orange-50",
            },
            {
              icon: <TrophyIcon className="w-6 h-6 text-blue-500" />,
              value: "95%",
              label: "Satisfaction Rate",
              bg: "bg-blue-50",
            },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 px-8 py-6">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-4 anim-fade-up delay-10">
          Join thousands of students learning smarter every day.
        </p>
      </section>
    </div>
  );
}