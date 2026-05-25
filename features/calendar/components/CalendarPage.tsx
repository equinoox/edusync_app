'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

import Sidebar from '@/components/layout/sidebar';
import SmallBar from '@/components/layout/SmallBar';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { QuickActionsPanel } from '@/components/shared/QuickActionsPanel';
import {
  ToastNotification,
  type ToastNotificationState,
} from '@/components/shared/ToastNotification';
import { ViewAllModal } from '@/components/shared/ViewAllModal';
import {
  createCalendarEventAction,
  deleteCalendarEventAction,
  updateCalendarEventAction,
} from '@/features/calendar/actions/calendar.action';
import { CalendarEventCard } from '@/features/calendar/components/CalendarEventCard';
import { CalendarEventDetailsModal } from '@/features/calendar/components/CalendarEventDetailsModal';
import { CalendarHeader } from '@/features/calendar/components/CalendarHeader';
import { CalendarMonthGrid } from '@/features/calendar/components/CalendarMonthGrid';
import { CreateCalendarEventModal } from '@/features/calendar/components/CreateCalendarEventModal';
import type {
  CalendarDay,
  CalendarEvent,
  CreateCalendarEventInput,
} from '@/features/calendar/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';

const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
});

const dayKey = (date: Date | string) => new Date(date).toISOString().slice(0, 10);

const startOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const isSameDay = (first: Date | string, second: Date | string) =>
  dayKey(first) === dayKey(second);

const buildCalendarDays = (
  visibleMonth: Date,
  events: CalendarEvent[],
): CalendarDay[] => {
  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const firstGridDay = new Date(firstDay);
  firstGridDay.setDate(firstGridDay.getDate() - mondayOffset);
  const today = startOfDay(new Date());
  const eventsByDay = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const key = dayKey(event.date);
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), event]);
  }

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDay);
    date.setDate(firstGridDay.getDate() + index);

    return {
      date,
      isCurrentMonth: date.getMonth() === visibleMonth.getMonth(),
      isToday: isSameDay(date, today),
      events: eventsByDay.get(dayKey(date)) ?? [],
    };
  });
};

const getMiniCalendarDays = (visibleMonth: Date) => {
  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const firstGridDay = new Date(firstDay);
  firstGridDay.setDate(firstGridDay.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDay);
    date.setDate(firstGridDay.getDate() + index);
    return date;
  });
};

export function CalendarPage() {
  const { darkMode } = useTheme();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfDay(new Date()));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastNotificationState | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = useCallback(
    (message: string, tone: ToastNotificationState['tone'] = 'info') => {
      setToast({ id: Date.now(), message, tone });
    },
    [],
  );

  const loadEvents = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/calendar?year=${visibleMonth.getFullYear()}&month=${visibleMonth.getMonth()}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to load calendar events');
      }

      setEvents(data as CalendarEvent[]);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, visibleMonth]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const monthLabel = monthFormatter.format(visibleMonth);
  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth, events),
    [events, visibleMonth],
  );
  const upcomingEvents = useMemo(
    () =>
      events
        .filter(event => startOfDay(new Date(event.date)).getTime() >= startOfDay(new Date()).getTime())
        .sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime()),
    [events],
  );
  const miniCalendarDays = useMemo(
    () => getMiniCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const quickActions = useMemo(
    () => [
      {
        id: 'add-event',
        label: 'Add Event',
        Icon: PlusIcon,
        onClick: () => setIsCreateModalOpen(true),
      },
      {
        id: 'quizzes',
        label: 'Open Quizzes',
        href: '/quizzes',
        Icon: ClipboardDocumentListIcon,
      },
      {
        id: 'assistant',
        label: 'Ask AI Assistant',
        href: '/chat',
        Icon: ChatBubbleLeftRightIcon,
      },
    ],
    [],
  );

  const goToPreviousMonth = () => {
    setVisibleMonth(previous => new Date(previous.getFullYear(), previous.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setVisibleMonth(previous => new Date(previous.getFullYear(), previous.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setVisibleMonth(startOfDay(new Date()));
  };

  const handleSubmitEvent = (input: CreateCalendarEventInput) => {
    startTransition(async () => {
      const result = eventToEdit
        ? await updateCalendarEventAction(eventToEdit.id, input)
        : await createCalendarEventAction(input);

      if (typeof result === 'string') {
        showToast(result, 'error');
        return;
      }

      showToast(eventToEdit ? 'Event updated' : 'Event created', 'success');
      setIsCreateModalOpen(false);
      setEventToEdit(null);
      setSelectedEvent(null);
      await loadEvents();
    });
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    const result = await deleteCalendarEventAction(eventToDelete.id);
    setIsDeleting(false);

    if (typeof result === 'string') {
      showToast(result, 'error');
      return;
    }

    showToast('Event deleted', 'success');
    setEventToDelete(null);
    setSelectedEvent(null);
    await loadEvents();
  };

  const handleTakeQuiz = (event: CalendarEvent) => {
    if (!event.quizId) return;
    router.push(`/quizzes?take=${event.quizId}`);
  };

  return (
    <main className={cn('flex h-screen overflow-hidden transition-colors duration-300', darkMode ? 'bg-slate-950' : 'bg-slate-300')}>
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
      <CreateCalendarEventModal
        isOpen={isCreateModalOpen || Boolean(eventToEdit)}
        isSaving={isPending}
        initialEvent={eventToEdit}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEventToEdit(null);
        }}
        onSubmit={handleSubmitEvent}
      />
      <CalendarEventDetailsModal
        event={selectedEvent}
        isSaving={isPending || isDeleting}
        onClose={() => setSelectedEvent(null)}
        onEdit={event => {
          setSelectedEvent(null);
          setEventToEdit(event);
        }}
        onDelete={setEventToDelete}
        onTakeQuiz={handleTakeQuiz}
      />
      <ConfirmationModal
        isOpen={Boolean(eventToDelete)}
        isLoading={isDeleting}
        message="Are you sure you want to delete this event?"
        loadingLabel="Deleting..."
        onCancel={() => setEventToDelete(null)}
        onConfirm={handleDeleteEvent}
      />
      <ViewAllModal
        isOpen={isUpcomingModalOpen}
        title="All Upcoming Events"
        items={upcomingEvents}
        emptyMessage="No upcoming events."
        onClose={() => setIsUpcomingModalOpen(false)}
        renderItem={event => (
          <CalendarEventCard
            key={event.id}
            event={event}
            onSelect={selected => {
              setIsUpcomingModalOpen(false);
              setSelectedEvent(selected);
            }}
          />
        )}
      />
      <ViewAllModal
        isOpen={Boolean(selectedDay)}
        title={
          selectedDay
            ? `Events on ${selectedDay.date.toLocaleDateString()}`
            : 'Day Events'
        }
        items={selectedDay?.events ?? []}
        emptyMessage="No events for this day."
        onClose={() => setSelectedDay(null)}
        renderItem={event => (
          <CalendarEventCard
            key={event.id}
            event={event}
            onSelect={selected => {
              setSelectedDay(null);
              setSelectedEvent(selected);
            }}
          />
        )}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar sidebarOpen={sidebarOpen} />
      </div>

      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <SmallBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          actions={
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex h-9 items-center gap-1 rounded-lg bg-violet-600 px-3 text-sm font-bold text-white"
            >
              <PlusIcon className="h-4 w-4" />
              Event
            </button>
          }
        />

        <div className="min-h-0 flex-1 p-3 sm:p-4 lg:p-5">
          <div
            className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border p-4 sm:p-5 ${
              darkMode
                ? 'border-white/5 bg-slate-900'
                : 'border-slate-500 bg-slate-400'
            }`}
          >
            <CalendarHeader
              monthLabel={monthLabel}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
              onToday={goToToday}
              onCreateEvent={() => setIsCreateModalOpen(true)}
            />

            <div className="mt-5 grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
              <section className="min-h-0 overflow-y-auto pr-1">
                {isLoading ? (
                  <div className={`grid min-h-[34rem] place-items-center rounded-xl border border-dashed ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-500 bg-slate-300'}`}>
                    <span className={`h-9 w-9 animate-spin rounded-full border-2 border-t-transparent ${darkMode ? 'border-violet-300' : 'border-violet-700'}`} />
                  </div>
                ) : (
                  <CalendarMonthGrid
                    days={calendarDays}
                    onSelectEvent={setSelectedEvent}
                    onViewDayEvents={setSelectedDay}
                  />
                )}
              </section>

              <aside className="min-h-0 space-y-5 overflow-y-auto pr-1">
                <section className={`rounded-xl border p-5 shadow-md ${darkMode ? 'border-white/5 bg-slate-800' : 'border-slate-500 bg-slate-300'}`}>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                      Mini Calendar
                    </h2>
                    <span className={darkMode ? 'text-sm text-slate-300' : 'text-sm text-slate-700'}>
                      {monthLabel}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                      <span key={day} className={darkMode ? 'text-slate-400' : 'text-slate-700'}>
                        {day}
                      </span>
                    ))}
                    {miniCalendarDays.map(day => (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => setVisibleMonth(new Date(day.getFullYear(), day.getMonth(), 1))}
                        className={cn(
                          'flex h-8 items-center justify-center rounded-full text-sm',
                          isSameDay(day, new Date())
                            ? 'bg-violet-600 font-bold text-white'
                            : day.getMonth() === visibleMonth.getMonth()
                              ? darkMode
                                ? 'text-white hover:bg-slate-700'
                                : 'text-slate-950 hover:bg-slate-400'
                              : darkMode
                                ? 'text-slate-600'
                                : 'text-slate-600',
                        )}
                      >
                        {day.getDate()}
                      </button>
                    ))}
                  </div>
                </section>

                <section className={`rounded-xl border p-5 shadow-md ${darkMode ? 'border-white/5 bg-slate-800' : 'border-slate-500 bg-slate-300'}`}>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                      Upcoming Events
                    </h2>
                    <button
                      type="button"
                      onClick={() => setIsUpcomingModalOpen(true)}
                      className="text-sm font-medium text-violet-400"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {upcomingEvents.length === 0 ? (
                      <p className={darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-700'}>
                        No upcoming events.
                      </p>
                    ) : (
                      upcomingEvents.slice(0, 4).map(event => (
                        <CalendarEventCard
                          key={event.id}
                          event={event}
                          onSelect={setSelectedEvent}
                        />
                      ))
                    )}
                  </div>
                </section>

                <QuickActionsPanel items={quickActions} />
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
