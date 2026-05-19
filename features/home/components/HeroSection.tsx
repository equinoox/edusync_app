"use client";

import Link from "next/link";
import { ArrowUpTrayIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import type { HeroSectionProps } from "@/features/home/types";

export default function HeroSection({ firstName }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-400 via-gray-300 to-gray-500 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 animate-hero-section animate-stagger-1">

      <div className="absolute top-0 right-0 w-80 h-80 bg-gray-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-gray-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* GRID !!! */}
      <div className="hidden md:block absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(to right, #6d28d9 1px, transparent 1px), linear-gradient(to bottom, #6d28d9 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="hidden md:block pointer-events-none">
        <svg className="absolute top-6 left-[12%] w-10 h-10 text-violet-800/60 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
        </svg>
        <svg className="absolute top-10 left-[38%] w-7 h-7 text-violet-700/50 animate-pulse [animation-delay:400ms]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
        </svg>
        <svg className="absolute bottom-8 left-[18%] w-8 h-8 text-orange-900/50 animate-pulse [animation-delay:700ms]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
        </svg>
        <svg className="absolute top-1/2 left-[6%] w-3.5 h-3.5 text-orange-900/50 animate-pulse [animation-delay:200ms]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
        </svg>
        <svg className="absolute bottom-12 left-[55%] w-7 h-7 text-violet-700/60 animate-pulse [animation-delay:600ms]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
        </svg>
        <svg className="absolute top-4 left-[62%] w-8 h-8 text-orange-900/50 animate-pulse [animation-delay:900ms]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
        </svg>

        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full border border-violet-400/20" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-violet-400/10" />
      </div>

      <div className="relative flex-1 z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 tracking-tight">
          Master any subject<br />
          with <span className="text-violet-600">EduSync</span>
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-sm">
          Upload your study materials and chat with our AI assistant to understand, practice, and excel.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-violet-200"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            Chat with AI Assistant
          </Link>
          <Link
            href="/documents"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold border border-orange-400 transition-colors"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            Upload PDF
          </Link>
        </div>
      </div>

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
            Hi {firstName}! 👋 Upload your notes or a PDF and I will help you understand the topic step by step.
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
  );
}