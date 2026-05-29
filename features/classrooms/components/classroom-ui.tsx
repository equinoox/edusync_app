import {
  AcademicCapIcon,
  BeakerIcon,
  BookOpenIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  WrenchIcon
} from '@heroicons/react/24/outline';

import type {
  ClassroomColor,
  ClassroomIcon,
} from '@/features/classrooms/options';
import type { ClassroomIconComponent } from '@/features/classrooms/types';

export const classroomColorOptions = [
  {
    value: 'violet',
    label: 'Purple',
    swatchClass: 'bg-violet-500',
    iconClass: 'bg-violet-500/15 text-violet-500',
    darkIconClass: 'bg-violet-500/20 text-violet-300',
    borderClass: 'border-violet-500/30',
    actionClass: 'text-violet-500',
    darkActionClass: 'text-violet-300',
    progressClass: 'bg-violet-500',
    glowClass: 'from-violet-500/20',
  },
  {
    value: 'orange',
    label: 'Orange',
    swatchClass: 'bg-orange-500',
    iconClass: 'bg-orange-500/15 text-orange-500',
    darkIconClass: 'bg-orange-500/20 text-orange-300',
    borderClass: 'border-orange-500/30',
    actionClass: 'text-orange-500',
    darkActionClass: 'text-orange-300',
    progressClass: 'bg-orange-500',
    glowClass: 'from-orange-500/20',
  },
  {
    value: 'green',
    label: 'Green',
    swatchClass: 'bg-emerald-500',
    iconClass: 'bg-emerald-500/15 text-emerald-500',
    darkIconClass: 'bg-emerald-500/20 text-emerald-300',
    borderClass: 'border-emerald-500/30',
    actionClass: 'text-emerald-500',
    darkActionClass: 'text-emerald-300',
    progressClass: 'bg-emerald-500',
    glowClass: 'from-emerald-500/20',
  },
  {
    value: 'blue',
    label: 'Blue',
    swatchClass: 'bg-sky-500',
    iconClass: 'bg-sky-500/15 text-sky-500',
    darkIconClass: 'bg-sky-500/20 text-sky-300',
    borderClass: 'border-sky-500/30',
    actionClass: 'text-sky-500',
    darkActionClass: 'text-sky-300',
    progressClass: 'bg-sky-500',
    glowClass: 'from-sky-500/20',
  },
  {
    value: 'pink',
    label: 'Pink',
    swatchClass: 'bg-pink-500',
    iconClass: 'bg-pink-500/15 text-pink-500',
    darkIconClass: 'bg-pink-500/20 text-pink-300',
    borderClass: 'border-pink-500/30',
    actionClass: 'text-pink-500',
    darkActionClass: 'text-pink-300',
    progressClass: 'bg-pink-500',
    glowClass: 'from-pink-500/20',
  },
  {
    value: 'teal',
    label: 'Teal',
    swatchClass: 'bg-teal-500',
    iconClass: 'bg-teal-500/15 text-teal-500',
    darkIconClass: 'bg-teal-500/20 text-teal-300',
    borderClass: 'border-teal-500/30',
    actionClass: 'text-teal-500',
    darkActionClass: 'text-teal-300',
    progressClass: 'bg-teal-500',
    glowClass: 'from-teal-500/20',
  },
] satisfies Array<{
  value: ClassroomColor;
  label: string;
  swatchClass: string;
  iconClass: string;
  darkIconClass: string;
  borderClass: string;
  actionClass: string;
  darkActionClass: string;
  progressClass: string;
  glowClass: string;
}>;

export const classroomIconOptions = [
  { value: 'building', label: 'Engineering', Icon: WrenchIcon },
  { value: 'math', label: 'Math', Icon: AcademicCapIcon },
  { value: 'science', label: 'Science', Icon: BeakerIcon },
  { value: 'book', label: 'Literature', Icon: BookOpenIcon },
  { value: 'globe', label: 'History', Icon: GlobeAltIcon },
  { value: 'code', label: 'Code', Icon: CodeBracketIcon },
] satisfies Array<{
  value: ClassroomIcon;
  label: string;
  Icon: ClassroomIconComponent;
}>;

export function getClassroomColorOption(color: string) {
  return (
    classroomColorOptions.find(option => option.value === color) ??
    classroomColorOptions[0]
  );
}

export function getClassroomIconOption(icon: string) {
  return (
    classroomIconOptions.find(option => option.value === icon) ??
    classroomIconOptions[0]
  );
}
