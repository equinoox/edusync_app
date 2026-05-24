export const classroomColorValues = [
  'violet',
  'orange',
  'green',
  'blue',
  'pink',
  'teal',
] as const;

export const classroomIconValues = [
  'building',
  'math',
  'science',
  'book',
  'globe',
  'code',
] as const;

export type ClassroomColor = (typeof classroomColorValues)[number];
export type ClassroomIcon = (typeof classroomIconValues)[number];
