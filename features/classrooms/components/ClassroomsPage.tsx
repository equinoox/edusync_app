'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  BookOpenIcon,
  BuildingLibraryIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  PlusIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

import Sidebar from '@/components/layout/sidebar';
import SmallBar from '@/components/layout/SmallBar';
import TopBar from '@/components/layout/TopBar';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { QuickActionsPanel } from '@/components/shared/QuickActionsPanel';
import {
  RecentActivityPanel,
  type RecentActivityItem,
} from '@/components/shared/RecentActivityPanel';
import {
  ToastNotification,
  type ToastNotificationState,
} from '@/components/shared/ToastNotification';
import { ViewAllModal } from '@/components/shared/ViewAllModal';
import {
  createClassroomAction,
  deleteClassroomAction,
} from '@/features/classrooms/actions/classrooms.action';
import { ClassroomActionsMenu } from '@/features/classrooms/components/ClassroomActionsMenu';
import { ClassroomCard } from '@/features/classrooms/components/ClassroomCard';
import { ClassroomDetailsModal } from '@/features/classrooms/components/ClassroomDetailsModal';
import { ClassroomStatCard } from '@/features/classrooms/components/ClassroomStatCard';
import { ClassroomsDashboardHeader } from '@/features/classrooms/components/ClassroomsDashboardHeader';
import { CreateClassroomButton } from '@/features/classrooms/components/CreateClassroomButton';
import { CreateClassroomModal } from '@/features/classrooms/components/CreateClassroomModal';
import { UpcomingPanel } from '@/features/classrooms/components/UpcomingPanel';
import type {
  ClassroomListItem,
  ClassroomSortOrder,
  CreateClassroomInput,
} from '@/features/classrooms/types';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

const ACTIVITY_DESCRIPTION_LIMIT = 80;

const getActivityDescription = (description: string) => {
  const normalizedDescription = description.replace(/\s+/g, ' ').trim();

  if (normalizedDescription.length <= ACTIVITY_DESCRIPTION_LIMIT) {
    return normalizedDescription;
  }

  return `${normalizedDescription.slice(0, ACTIVITY_DESCRIPTION_LIMIT).trim()}...`;
};

export function ClassroomsPage() {
  const { darkMode } = useTheme();
  const { isLoaded, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassroomListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomListItem | null>(null);
  const [classroomToDelete, setClassroomToDelete] = useState<ClassroomListItem | null>(null);
  const [classroomToCreate, setClassroomToCreate] = useState<CreateClassroomInput | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotificationState | null>(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<ClassroomSortOrder>('desc');
  const [currentRole, setCurrentRole] = useState<'student' | 'professor' | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const role = currentRole ?? user?.publicMetadata?.role;
  const isProfessor = role === 'professor';

  const showToast = useCallback((message: string, tone: ToastNotificationState['tone'] = 'info', statusCode?: ToastNotificationState['statusCode']) => {
    setToast({ id: Date.now(), message, tone, statusCode });
  }, []);

  const loadClassrooms = useCallback(async (options?: { quiet?: boolean }) => {
    if (!isLoaded || !role) return;

    if (!options?.quiet) {
      setIsLoading(true);
    }

    try {
      const response = await fetch('/api/classrooms');
      const data = await response.json();

      if (!response.ok) {
        showToast(data.error ?? 'Something went wrong', 'error', response.status);
        return;
      }

      setCurrentRole(data.role);
      setClassrooms(data.classrooms);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, role, showToast]);

  useEffect(() => {
    void loadClassrooms();
  }, [loadClassrooms]);

  const filteredClassrooms = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return classrooms
      .filter(classroom => {
        if (!normalizedSearch) return true;

        return (
          classroom.title.toLowerCase().includes(normalizedSearch) ||
          classroom.description.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((first, second) => {
        const firstDate = new Date(first.createdAt).getTime();
        const secondDate = new Date(second.createdAt).getTime();
        return sortOrder === 'desc' ? secondDate - firstDate : firstDate - secondDate;
      });
  }, [classrooms, search, sortOrder]);

  const totalStudents = useMemo(
    () =>
      classrooms.reduce(
        (total, classroom) => total + classroom.numberOfStudents,
        0,
      ),
    [classrooms],
  );

  const allRecentActivityItems = useMemo<RecentActivityItem[]>(
    () =>
      classrooms.map(classroom => ({
        id: classroom.id,
        title: `Classroom created in ${classroom.title}`,
        description: getActivityDescription(classroom.description),
        timestamp: classroom.createdAt,
        Icon: BuildingLibraryIcon,
      })),
    [classrooms],
  );

  const quickActions = useMemo(
    () => [
      ...(isProfessor
        ? [
            {
              id: 'create-classroom',
              label: 'Create Classroom',
              Icon: PlusIcon,
              onClick: () => setIsCreateModalOpen(true),
            },
          ]
        : []),
      {
        id: 'documents',
        label: 'Open Documents',
        href: '/documents',
        Icon: DocumentTextIcon,
      },
      {
        id: 'chat',
        label: 'Ask AI Assistant',
        href: '/chat',
        Icon: ChatBubbleLeftRightIcon,
      },
    ],
    [isProfessor],
  );

  const handleCreateClassroom = () => {
    if (!classroomToCreate) return;

    setCreateError(null);

    startTransition(async () => {
      const result = await createClassroomAction(classroomToCreate);

      if (!result || typeof result === 'string') {
        setCreateError(result || 'Something went wrong');
        setClassroomToCreate(null);
        return;
      }

      setClassrooms(previousClassrooms => [result, ...previousClassrooms]);
      setClassroomToCreate(null);
      setIsCreateModalOpen(false);
      showToast('Classroom created', 'success');
    });
  };

  const handleDeleteClassroom = async () => {
    if (!classroomToDelete) return;

    setIsDeleting(true);
    const result = await deleteClassroomAction(classroomToDelete.id);
    setIsDeleting(false);

    if (typeof result === 'string') {
      showToast(result, 'error');
      return;
    }

    setClassrooms(previousClassrooms =>
      previousClassrooms.filter(classroom => classroom.id !== classroomToDelete.id),
    );
    if (selectedClassroom?.id === classroomToDelete.id) {
      setSelectedClassroom(null);
    }
    setClassroomToDelete(null);
    showToast('Classroom deleted', 'success');
  };

  const handleCloseClassroomDetails = useCallback(() => {
    setSelectedClassroom(null);
  }, []);

  const handleClassroomChanged = useCallback(() => {
    void loadClassrooms({ quiet: true });
  }, [loadClassrooms]);

  return (
    <main className={cn('flex min-h-screen overflow-y-auto transition-colors duration-300 lg:h-screen lg:overflow-hidden', darkMode ? 'bg-slate-950' : 'bg-slate-50')}>
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        isSaving={isPending}
        error={createError}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={setClassroomToCreate}
      />
      <ConfirmationModal
        isOpen={Boolean(classroomToCreate)}
        isLoading={isPending}
        message="Are you sure you want to create this classroom?"
        loadingLabel="Creating..."
        onCancel={() => setClassroomToCreate(null)}
        onConfirm={handleCreateClassroom}
      />
      <ConfirmationModal
        isOpen={Boolean(classroomToDelete)}
        isLoading={isDeleting}
        message="Are you sure you want to delete this classroom?"
        loadingLabel="Deleting..."
        onCancel={() => setClassroomToDelete(null)}
        onConfirm={handleDeleteClassroom}
      />
      <ClassroomDetailsModal
        classroom={selectedClassroom}
        onClose={handleCloseClassroomDetails}
        onToast={showToast}
        onChanged={handleClassroomChanged}
      />
      <ViewAllModal
        isOpen={isActivityModalOpen}
        title="All Classroom Activity"
        items={allRecentActivityItems}
        emptyMessage="No classroom activity yet."
        onClose={() => setIsActivityModalOpen(false)}
        renderItem={item => {
          const Icon = item.Icon ?? BuildingLibraryIcon;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-xl border p-4 ${
                darkMode
                  ? 'border-white/5 bg-slate-800'
                  : 'border-slate-300 bg-slate-200'
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  darkMode
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'bg-violet-500/15 text-violet-700'
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold">{item.title}</p>
                <p
                  className={`mt-1 line-clamp-2 text-xs ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {item.description}
                </p>
              </div>
              {item.timestamp && (
                <time
                  className={`shrink-0 text-xs ${
                    darkMode ? 'text-slate-500' : 'text-slate-600'
                  }`}
                >
                  {new Date(item.timestamp).toLocaleDateString()}
                </time>
              )}
            </div>
          );
        }}
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

      <section className="relative flex min-w-0 flex-1 flex-col overflow-visible lg:overflow-hidden">
        <SmallBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          actions={
            isProfessor ? (
              <CreateClassroomButton
                compact
                onClick={() => setIsCreateModalOpen(true)}
              />
            ) : undefined
          }
        />

        <div className="hidden lg:block">
          <TopBar pageName="Classrooms" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:overflow-hidden">
          <div className={`flex min-h-full flex-col overflow-visible rounded-2xl border p-3.5 sm:p-4 lg:h-full lg:min-h-0 lg:overflow-hidden ${darkMode ? "border-white/5 bg-slate-900" : "border-slate-200 bg-white"}`}>
            <ClassroomsDashboardHeader
              isProfessor={isProfessor}
              search={search}
              sortOrder={sortOrder}
              role={isProfessor ? 'professor' : role === 'student' ? 'student' : null}
              onSearchChange={setSearch}
              onSortOrderChange={setSortOrder}
              onCreateClassroom={() => setIsCreateModalOpen(true)}
            />

            <div className="mt-5 grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <ClassroomStatCard
                icon={BuildingLibraryIcon}
                label="Classrooms"
                value={classrooms.length}
                tone="violet"
              />
              <ClassroomStatCard
                icon={UsersIcon}
                label="Students"
                value={totalStudents}
                tone="orange"
              />
              <ClassroomStatCard
                icon={DocumentTextIcon}
                label="Materials"
                value={0}
                tone="green"
              />
              <ClassroomStatCard
                icon={ClipboardDocumentListIcon}
                label="Documents"
                value={0}
                tone="blue"
              />
            </div>

            <div className="mt-5 grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <section className="flex min-h-0 min-w-0 flex-col">
                <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
                  <h2 className={`font-bold ${darkMode ? "text-white" : "text-slate-950"}`}>
                    Your Classrooms
                  </h2>
                  {isLoading && (
                    <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Loading...
                    </span>
                  )}
                </div>

                {isLoading && classrooms.length === 0 ? (
                  <div className={`grid min-h-48 place-items-center rounded-xl border border-dashed ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}>
                    <span className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${darkMode ? "border-violet-300" : "border-violet-700"}`} />
                  </div>
                ) : filteredClassrooms.length > 0 ? (
                  <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto pr-1 md:grid-cols-2 2xl:grid-cols-3">
                    {filteredClassrooms.map((classroom, index) => (
                      <ClassroomCard
                        key={classroom.id}
                        classroom={classroom}
                        onView={setSelectedClassroom}
                        animationDelayMs={Math.min(index, 8) * 45}
                        actions={
                          <ClassroomActionsMenu
                            canDelete={isProfessor}
                            classroomTitle={classroom.title}
                            onDelete={() => setClassroomToDelete(classroom)}
                          />
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`rounded-xl border border-dashed px-4 py-10 text-center ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-white"}`}>
                    <BookOpenIcon className={`mx-auto h-10 w-10 ${darkMode ? "text-violet-300" : "text-violet-500"}`} />
                    <h3 className={`mt-3 font-semibold ${darkMode ? "text-white" : "text-slate-950"}`}>
                      No classrooms found
                    </h3>
                    <p className={`mx-auto mt-1 max-w-md text-sm ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
                      {isProfessor
                        ? 'Create a classroom to start organizing students and materials.'
                        : 'Joined classrooms will appear here.'}
                    </p>
                  </div>
                )}

                {isProfessor && !isLoading && (
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className={`mt-4 flex h-14 w-full shrink-0 items-center justify-center gap-3 rounded-xl border border-dashed text-sm font-bold transition ${darkMode ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-100"}`}
                  >
                    <PlusIcon className="h-6 w-6" />
                    Create New Classroom
                  </button>
                )}
              </section>

              <div className="min-h-0 space-y-4 overflow-visible xl:overflow-y-auto xl:pr-1">
                <UpcomingPanel />
                <RecentActivityPanel
                  emptyMessage="No classroom activity yet."
                  items={allRecentActivityItems}
                  previewLimit={2}
                  onViewAll={() => setIsActivityModalOpen(true)}
                />
                <QuickActionsPanel items={quickActions} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
