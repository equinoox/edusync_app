import React from "react";

interface ClassroomCardProps {
  icon: React.ReactNode;
  name: string;
  topics: string;
  quizCount: number;
  progress: number;
}

export default function ClassroomCard({
  icon,
  name,
  topics,
  quizCount,
  progress,
}: ClassroomCardProps) {
  const progressColor =
    progress >= 85
      ? "text-emerald-600 bg-emerald-50"
      : progress >= 70
      ? "text-amber-600 bg-amber-50"
      : "text-violet-600 bg-violet-50";

  return (
    <div className="group flex flex-col gap-4 p-5 bg-blue-100 rounded-2xl border border-blue-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100 transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors duration-200">
          {icon}
        </div>
        <button className="text-gray-300 hover:text-gray-500 transition-colors p-1 -mr-1 -mt-1">
          <EllipsisIcon />
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{name}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{topics}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <QuizIcon />
          <span>{quizCount} Quizzes</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${progressColor}`}>
          {progress}% Progress
        </span>
      </div>
    </div>
  );
}

function EllipsisIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function QuizIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="15" x2="13" y2="15" />
    </svg>
  );
}