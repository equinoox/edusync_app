"use client";

import "@/styles/loader.css";

import { useEffect, useState } from "react";

const MESSAGES = [
  "We are preparing your digital brain",
  "We go through your notes for you",
  "Personalizing your experience",
];

export function Loader() {
  const [msg, setMsg] = useState("We are preparing your digital brain");

  useEffect(() => {
    const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMsg(randomMsg);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">


      {/* Background layer */}
      <div className="loader-bg" />

      <div className="loader-wrapper flex items-center gap-14">

        {/* ── Left cards ── */}
        <div className="side-left flex flex-col gap-4 w-52">
          {[
            { color:"#6366f1", bg:"bg-indigo-50", title:"Materials",  sub:"Loading your PDFs",    dur:"3.2s", d:"0.3s", fin:"0.3s",
              svg: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></> },
            { color:"#3b82f6", bg:"bg-blue-50",   title:"Progress",   sub:"Syncing your data",    dur:"4s",   d:"1s",   fin:"0.5s",
              svg: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
            { color:"#22c55e", bg:"bg-green-50",  title:"Classrooms", sub:"Fetching your spaces", dur:"3.7s", d:"0.5s", fin:"0.7s",
              svg: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
          ].map((c) => (
            <div key={c.title} className="sc bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 px-5 py-4 flex items-center gap-3"
                 style={{ "--dur":c.dur, "--delay":c.d, "--fin":c.fin } as React.CSSProperties}>
              <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{c.svg}</svg>
              </div>
              <div>
                <p className="text-slate-800 text-sm font-semibold">{c.title}</p>
                <p className="text-slate-400 text-xs">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Center ── */}
        <div className="flex flex-col items-center gap-8">
          {/* Orbital rig */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-300/30"
                 style={{ animation:"pulse-ring 2.2s ease-in-out infinite" }} />
            <div className="absolute inset-6 rounded-full border border-indigo-200/20"
                 style={{ animation:"pulse-ring 2.2s ease-in-out 0.5s infinite" }} />
            <div className="absolute inset-12 rounded-full border border-indigo-100/20"
                 style={{ animation:"pulse-ring 2.2s ease-in-out 0.9s infinite" }} />

            <div className="orbit-dot od1" />
            <div className="orbit-dot od2" />
            <div className="orbit-dot od3" />
            <div className="orbit-dot od4" />

            {/* Core — doubled from previous w-24 → w-[7.5rem] */}
            <div className="w-[7.5rem] h-[7.5rem] rounded-[2rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-300/50"
                 style={{ animation:"pulse-core 2s ease-in-out infinite" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>

          {/* Text — static, larger */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-800 text-xl font-bold tracking-tight text-center max-w-xs">
              {msg}
            </p>
            <p className="text-slate-400 text-sm">This will only take a moment</p>
          </div>

          {/* Progress bar */}
          <div className="w-72 h-1 bg-indigo-100 rounded-full overflow-hidden">
            <div className="shimmer-bar" />
          </div>
        </div>

        {/* ── Right cards ── */}
        <div className="side-right flex flex-col gap-4 w-52">
          {[
            { color:"#f59e0b", bg:"bg-amber-50",  title:"Quizzes",      sub:"Preparing your tests",  dur:"3.8s", d:"0.6s", fin:"0.3s",
              svg: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
            { color:"#f97316", bg:"bg-orange-50", title:"Analytics",    sub:"Crunching insights",    dur:"4.2s", d:"1.1s", fin:"0.5s",
              svg: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></> },
            { color:"#8b5cf6", bg:"bg-purple-50", title:"Achievements", sub:"Loading your badges",   dur:"3.5s", d:"0.3s", fin:"0.7s",
              svg: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/> },
          ].map((c) => (
            <div key={c.title} className="sc bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 px-5 py-4 flex items-center gap-3"
                 style={{ "--dur":c.dur, "--delay":c.d, "--fin":c.fin } as React.CSSProperties}>
              <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{c.svg}</svg>
              </div>
              <div>
                <p className="text-slate-800 text-sm font-semibold">{c.title}</p>
                <p className="text-slate-400 text-xs">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}