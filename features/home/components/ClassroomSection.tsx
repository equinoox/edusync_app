"use client";

import Link from "next/link";
import { useTheme } from "@/providers/ThemeProvider";
import {
  AcademicCapIcon,
  BeakerIcon,
  BookOpenIcon,
  CalculatorIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

type StickyColor = "yellow" | "blue" | "green" | "pink";
type ClassroomIcon = "function" | "flask" | "monitor" | "book";

interface Classroom {
  id: string;
  name: string;
  sub: string;
  quizzes: number;
  progress: number;
  icon: ClassroomIcon;
  color: StickyColor;
}

type StickyStyle = {
  bg: string;
  text: string;
  muted: string;
  rotate: string;
};

const SAMPLE_CLASSROOMS: Classroom[] = [
  {
    id: "1",
    name: "Mathematics",
    sub: "Algebra, Calculus, Geometry",
    quizzes: 12,
    progress: 85,
    icon: "function",
    color: "yellow",
  },
  {
    id: "2",
    name: "Physics",
    sub: "Mechanics, Thermo, EM",
    quizzes: 8,
    progress: 72,
    icon: "flask",
    color: "blue",
  },
  {
    id: "3",
    name: "Computer Science",
    sub: "Data Structures, Algorithms",
    quizzes: 10,
    progress: 90,
    icon: "monitor",
    color: "green",
  },
  {
    id: "4",
    name: "English",
    sub: "Vocab, Grammar, Comprehension",
    quizzes: 6,
    progress: 78,
    icon: "book",
    color: "pink",
  },

];

const SAMPLE_STICKY_STYLES: Record<StickyColor, StickyStyle> = {
  yellow: {
    bg: "#fff176",
    text: "#5d4037",
    muted: "#8d6e63",
    rotate: "-1.5deg",
  },
  blue: {
    bg: "#b3e5fc",
    text: "#0d47a1",
    muted: "#1565c0",
    rotate: "1.2deg",
  },
  green: {
    bg: "#c8e6c9",
    text: "#1b5e20",
    muted: "#2e7d32",
    rotate: "-0.8deg",
  },
  pink: {
    bg: "#f8bbd0",
    text: "#880e4f",
    muted: "#ad1457",
    rotate: "1.8deg",
  },
};

const CLASSROOM_ICONS: Record<ClassroomIcon, typeof AcademicCapIcon> = {
  function: CalculatorIcon,
  flask: BeakerIcon,
  monitor: CodeBracketIcon,
  book: BookOpenIcon,
};

const getStaggerClass = (index: number) => {
  const staggerClasses = [
    "animate-stagger-1",
    "animate-stagger-2",
    "animate-stagger-3",
    "animate-stagger-4",
  ];

  return staggerClasses[index] ?? "animate-stagger-4";
};

export default function ClassroomSection() {
  const { darkMode } = useTheme();

  return (
    <section className="flex flex-col gap-6 animate-hero-section animate-stagger-2">
      <div className="text-center">
        <h2
          className={`mb-2 text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Your Classrooms
        </h2>

        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Access and manage your enrolled courses
        </p>
      </div>

      <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SAMPLE_CLASSROOMS.map((classroom, index) => {
          const stickyStyle = SAMPLE_STICKY_STYLES[classroom.color];
          const Icon = CLASSROOM_ICONS[classroom.icon];

          return (
            <div
              key={classroom.id}
              className={`animate-classroom-cards ${getStaggerClass(index)}`}
            >
              <Link href={`/classrooms/${classroom.id}`}>
                <div
                  className="mt-2 relative flex min-h-[190px] cursor-pointer flex-col rounded-[2px] px-[14px] pb-5 pt-5 transition-transform duration-150"
                  style={{
                    background: stickyStyle.bg,
                    transform: `rotate(${stickyStyle.rotate})`,
                    boxShadow: "3px 4px 0 rgba(0,0,0,0.10)",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.transform = "scale(1.04)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.transform = `rotate(${stickyStyle.rotate})`;
                  }}
                >
                  {/* tape strip */}
                  <div className="absolute left-1/2 top-[-10px] h-[18px] w-9 -translate-x-1/2 rounded-[2px] border border-black/10 bg-white/55" />

                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50"
                      style={{
                        color: stickyStyle.text,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <span
                      className="rounded-full bg-white/60 px-2 py-0.5 text-[13px] font-semibold"
                      style={{
                        fontFamily: "'Caveat', cursive",
                        color: stickyStyle.text,
                      }}
                    >
                      {classroom.progress}%
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <p
                      className="text-2xl font-semibold leading-tight"
                      style={{
                        fontFamily: "'Caveat', cursive",
                        color: stickyStyle.text,
                      }}
                    >
                      {classroom.name}
                    </p>

                    <p
                      className="mt-1 text-base leading-snug"
                      style={{
                        fontFamily: "'Caveat', cursive",
                        color: stickyStyle.muted,
                      }}
                    >
                      {classroom.sub}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between border-t border-dashed border-black/15 pt-2.5">
                    <span
                      className="text-[14px]"
                      style={{
                        fontFamily: "'Caveat', cursive",
                        color: stickyStyle.text,
                      }}
                    >
                      {classroom.quizzes} quizzes
                    </span>

                    <span
                      className="text-[14px] font-semibold"
                      style={{
                        fontFamily: "'Caveat', cursive",
                        color: stickyStyle.text,
                      }}
                    >
                      Open →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}