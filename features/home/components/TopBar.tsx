"use client";

import { UserButton } from "@clerk/nextjs";
import { BellIcon } from "@heroicons/react/24/outline";
import type { TopBarProps } from "@/features/home/types";

export default function TopBar({ displayName }: TopBarProps) {
  return (
    <div className="flex justify-end items-center gap-4 px-6 py-1 mt-3">
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
          <p className="text-lg font-semibold text-slate-800">{displayName}</p>
        </div>
      </div>
    </div>
  );
}
