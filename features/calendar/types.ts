import type { ComponentType, SVGProps } from 'react';
import type { z } from 'zod';

import type {
  calendarEventTypes,
  createCalendarEventSchema,
  getCalendarEventsByMonthSchema,
  updateCalendarEventSchema,
} from '@/features/calendar/schemas';

export type CalendarEventType = (typeof calendarEventTypes)[number];
export type CreateCalendarEventInput = z.infer<typeof createCalendarEventSchema>;
export type UpdateCalendarEventInput = z.infer<typeof updateCalendarEventSchema>;
export type GetCalendarEventsByMonthInput = z.infer<
  typeof getCalendarEventsByMonthSchema
>;

export type CalendarEvent = {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: Date | string;
  eventType: CalendarEventType;
  quizId: string | null;
  classroomId: string | null;
  classroomTitle: string | null;
  quizTitle: string | null;
  canManage: boolean;
  canTakeQuiz: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type CalendarIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type CalendarHeaderProps = {
  monthLabel: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onCreateEvent: () => void;
};

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
};

export type CalendarMonthGridProps = {
  days: CalendarDay[];
  onSelectEvent: (event: CalendarEvent) => void;
  onViewDayEvents: (day: CalendarDay) => void;
};

export type CalendarDayCellProps = {
  day: CalendarDay;
  onSelectEvent: (event: CalendarEvent) => void;
  onViewDayEvents: (day: CalendarDay) => void;
  animationDelayMs?: number;
};

export type CalendarEventCardProps = {
  event: CalendarEvent;
  compact?: boolean;
  onSelect: (event: CalendarEvent) => void;
};

export type CreateCalendarEventModalProps = {
  isOpen: boolean;
  isSaving: boolean;
  initialEvent?: CalendarEvent | null;
  onClose: () => void;
  onSubmit: (input: CreateCalendarEventInput) => void;
};

export type CalendarEventDetailsModalProps = {
  event: CalendarEvent | null;
  isSaving: boolean;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
  onTakeQuiz: (event: CalendarEvent) => void;
};
