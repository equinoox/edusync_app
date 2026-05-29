"use client";

import { useMemo } from "react";
import { CheckIcon, FireIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/providers/ThemeProvider";

const weekDayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getMondayBasedDayIndex = (date: Date) => (date.getDay() + 6) % 7;

function getStudyWeek(today: Date) {
  const todayIndex = getMondayBasedDayIndex(today);

  return weekDayLabels.map((label, index) => ({
    label,
    completed: index <= todayIndex,
    isToday: index === todayIndex,
    isNext: index === todayIndex + 1,
  }));
}

export default function StudyStreakCard() {
  const { darkMode } = useTheme();
  const days = useMemo(() => getStudyWeek(new Date()), []);
  const completedDays = days.filter((day) => day.completed).length;
  const streakLabel = `${completedDays} ${completedDays === 1 ? "day" : "days"} in a row! 🔥`;

  return (
    <section className={`edusync-enter edusync-card-motion relative overflow-hidden rounded-2xl border p-4 shadow-2xl ${darkMode ? 'border-white/10 bg-slate-900/80 shadow-slate-950/30' : 'border-slate-200 bg-white shadow-slate-200/70'}`}>
      <div className={`pointer-events-none absolute inset-0 ${darkMode ? 'bg-[radial-gradient(circle_at_12%_0%,rgba(124,58,237,0.18),transparent_30%),radial-gradient(circle_at_88%_50%,rgba(249,115,22,0.08),transparent_26%)]' : 'bg-[radial-gradient(circle_at_12%_0%,rgba(79,70,229,0.08),transparent_30%),radial-gradient(circle_at_88%_50%,rgba(249,115,22,0.06),transparent_26%)]'}`} />

      <div className="relative flex min-h-40 flex-col items-center justify-center gap-5 lg:flex-row lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-3 text-center">
            <FireIcon className="h-6 w-6 text-orange-400" />
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Study Streak</h2>
            <span className="text-sm font-bold text-orange-400">{streakLabel}</span>
          </div>

          <div className="mt-6 grid w-full max-w-3xl grid-cols-7 gap-2 sm:gap-3">
            {days.map((day) => (
              <div key={day.label} className="flex min-w-0 flex-col items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-white shadow-lg sm:h-11 sm:w-11 ${
                    day.completed
                      ? "border-violet-400/50 bg-violet-600 shadow-violet-950/50"
                      : day.isNext
                        ? darkMode ? "border-orange-500 bg-slate-950/70" : "border-orange-500 bg-white text-orange-500 shadow-slate-200/70"
                        : darkMode ? "border-slate-700 bg-slate-950/50" : "border-slate-300 bg-white text-slate-400 shadow-slate-200/70"
                  }`}
                >
                  {day.completed && <CheckIcon className="h-5 w-5 stroke-[3]" />}
                </span>
                <span className={`text-xs font-medium sm:text-sm ${day.isToday ? "text-orange-400" : darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative flex max-w-xs items-center justify-center gap-3 rounded-2xl border p-3.5 text-center sm:text-left ${darkMode ? 'border-white/5 bg-slate-950/35' : 'border-slate-200 bg-slate-50'}`}>
          <PaperAirplaneIcon className={`h-9 w-9 shrink-0 rotate-[-18deg] ${darkMode ? 'text-violet-300' : 'text-violet-600'}`} />
          <p className={`text-sm leading-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Keep it up! Consistency is the key to mastery.
          </p>
        </div>
      </div>
    </section>
  );
}
