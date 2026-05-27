"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpTrayIcon,
  BookOpenIcon,
  ChartPieIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import type { HeroSectionProps } from "@/features/home/types";

export default function HeroSection({ firstName }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-slate-950 p-6 shadow-2xl shadow-slate-950/40 animate-hero-section animate-stagger-1 md:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(124,58,237,0.24),transparent_30%),radial-gradient(circle_at_56%_16%,rgba(249,115,22,0.1),transparent_26%),linear-gradient(135deg,rgba(76,29,149,0.45),rgba(2,6,23,0.72)_42%,rgba(15,23,42,0.92))]" />
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.08] md:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 grid items-center gap-8 xl:grid-cols-[1.05fr_minmax(19rem,0.9fr)_22rem]">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Master any subject
            <br />
            with <span className="text-violet-500">EduSync</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
            Upload your study materials and chat with our AI assistant to understand, practice, and excel.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Chat with AI Assistant
            </Link>
            <Link
              href="/documents"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-400/70 bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400"
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
              Upload PDF
            </Link>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/5 bg-slate-950/35 p-4">
            {[
              {
                label: "Different Sources",
                value: "10K +",
                Icon: BookOpenIcon,
                tone: "text-violet-300 bg-violet-500/20",
              },
              {
                label: "Active Users",
                value: "300K +",
                Icon: TrophyIcon,
                tone: "text-orange-300 bg-orange-500/20",
              },
              {
                label: "Rating",
                value: "95%",
                Icon: ChartPieIcon,
                tone: "text-emerald-300 bg-emerald-500/20",
              },
            ].map(({ label, value, Icon, tone }) => (
              <div key={label} className="flex items-center justify-center gap-3 px-2">
                <span className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-full sm:flex ${tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-extrabold leading-tight text-white">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md justify-center xl:max-w-none">
          <div className="absolute inset-x-6 bottom-0 h-20 rounded-full bg-violet-600/20 blur-3xl" />
          <Image
            src="/home_hero_img.png"
            alt=""
            width={560}
            height={372}
            priority
            className="edusync-subtle-float relative h-auto w-full max-w-[34rem] object-contain"
          />
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
              AI
            </div>
            <div>
              <p className="text-sm font-bold text-white">EduSync AI</p>
              <p className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-300">
            Hi {firstName}! Upload your notes or a PDF and I will help you understand the topic step by step.
          </p>
          <div className="mt-5 ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-violet-600 p-4 shadow-lg shadow-violet-950/40">
            <p className="text-sm leading-6 text-white">
              Can you explain integration by parts in simple terms?
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce [animation-delay:0ms]" />
            <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </section>
  );
}
