"use client";

import Link from "next/link";
import { useTheme } from "@/providers/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

interface Classroom {
  id: string;
  name: string;
  studentCount: number;
  color: string;
}

// STATIC FOR NOW - LATER WILL BE DYNAMIC BASED ON USER'S ENROLLED CLASSROOMS
const SAMPLE_CLASSROOMS: Classroom[] = [
  {
    id: "1",
    name: "Calculus 101",
    studentCount: 24,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "2",
    name: "Physics Lab",
    studentCount: 18,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "3",
    name: "Chemistry Fundamentals",
    studentCount: 30,
    color: "from-green-500 to-green-600",
  },
  {
    id: "4",
    name: "Biology Advanced",
    studentCount: 22,
    color: "from-orange-500 to-orange-600",
  },
];

export default function ClassroomSection() {
  const { darkMode } = useTheme();

  return (
    <div className="flex flex-col gap-6 animate-hero-section animate-stagger-2">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Your Classrooms
        </h2>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Access and manage your enrolled courses
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SAMPLE_CLASSROOMS.map((classroom, index) => (
          <div
            key={classroom.id}
            className={`animate-classroom-cards ${
              index === 0
                ? "animate-stagger-1"
                : index === 1
                ? "animate-stagger-2"
                : index === 2
                ? "animate-stagger-3"
                : "animate-stagger-4"
            }`}
          >
            <Link href={`/classrooms/${classroom.id}`}>
              <Card
                className={`transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer h-full ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 hover:border-violet-500"
                    : "bg-white border-gray-200 hover:border-indigo-300"
                }`}
              >
                <CardHeader className={`pb-4 ${darkMode ? "border-b border-slate-700" : "border-b border-gray-200"}`}>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${classroom.color} flex items-center justify-center mb-3`}>
                    <AcademicCapIcon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className={`text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {classroom.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Students
                      </p>
                      <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {classroom.studentCount}
                      </p>
                    </div>
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${classroom.color} opacity-20 flex-shrink-0`}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
