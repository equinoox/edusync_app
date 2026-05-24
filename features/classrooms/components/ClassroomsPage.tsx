'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  BookOpenIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  PlusIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

import Sidebar from '@/components/layout/sidebar';
import SmallBar from '@/components/layout/SmallBar';
import TopBar from '@/components/layout/TopBar';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import {
  ToastNotification,
  type ToastNotificationState,
} from '@/components/shared/ToastNotification';
import {
  createClassroomAction,
  deleteClassroomAction,
  getProfessorClassroomsAction,
  getStudentClassroomsAction,
} from '@/features/classrooms/actions/classrooms.action';
import { ClassroomActionsMenu } from '@/features/classrooms/components/ClassroomActionsMenu';
import { ClassroomCard } from '@/features/classrooms/components/ClassroomCard';
import { ClassroomDetailsModal } from '@/features/classrooms/components/ClassroomDetailsModal';
import { ClassroomStatCard } from '@/features/classrooms/components/ClassroomStatCard';
import { ClassroomsDashboardHeader } from '@/features/classrooms/components/ClassroomsDashboardHeader';
import { CreateClassroomButton } from '@/features/classrooms/components/CreateClassroomButton';
import { CreateClassroomModal } from '@/features/classrooms/components/CreateClassroomModal';
import { RecentActivityPanel } from '@/features/classrooms/components/RecentActivityPanel';
import { UpcomingPanel } from '@/features/classrooms/components/UpcomingPanel';
import type {
  ClassroomListItem,
  CreateClassroomInput,
} from '@/features/classrooms/types';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

type SortOrder = 'desc' | 'asc';

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
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const role = user?.publicMetadata?.role;
  const isProfessor = role === 'professor';

  const showToast = useCallback((message: string, tone: ToastNotificationState['tone'] = 'info') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const loadClassrooms = useCallback(() => {
    if (!isLoaded || !role) return;

    setIsLoading(true);
    startTransition(async () => {
      const result = isProfessor
        ? await getProfessorClassroomsAction()
        : await getStudentClassroomsAction();

      if (typeof result === 'string') {
        showToast(result, 'error');
      } else {
        setClassrooms(result);
      }

      setIsLoading(false);
    });
  }, [isLoaded, isProfessor, role, showToast]);

  useEffect(() => {
    loadClassrooms();
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

  return (
    <main className={cn('flex h-screen overflow-hidden transition-colors duration-300', darkMode ? 'bg-slate-950' : 'bg-slate-200')}>
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
        onClose={() => setSelectedClassroom(null)}
        onToast={showToast}
        onChanged={loadClassrooms}
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

        <div className="min-h-0 flex-1 p-3 sm:p-4 lg:p-5">
          <div className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border p-4 sm:p-5 ${darkMode ? "border-white/5 bg-slate-900" : "border-slate-300/70 bg-slate-100/85"}`}>
            <ClassroomsDashboardHeader
              isProfessor={isProfessor}
              search={search}
              sortOrder={sortOrder}
              onSearchChange={setSearch}
              onSortOrderChange={setSortOrder}
              onCreateClassroom={() => setIsCreateModalOpen(true)}
            />

            <div className="mt-7 grid shrink-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                label="Lessons"
                value={0}
                tone="blue"
              />
            </div>

            <div className="mt-6 grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
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

                {filteredClassrooms.length > 0 ? (
                  <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto pr-1 md:grid-cols-2 2xl:grid-cols-3">
                    {filteredClassrooms.map(classroom => (
                      <ClassroomCard
                        key={classroom.id}
                        classroom={classroom}
                        onView={setSelectedClassroom}
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
                  <div className={`rounded-xl border border-dashed px-5 py-12 text-center ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-slate-400"}`}>
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

                {isProfessor && (
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className={`mt-5 flex h-16 w-full shrink-0 items-center justify-center gap-3 rounded-xl border border-dashed text-sm font-bold transition ${darkMode ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-slate-300 bg-slate-400 text-slate-700 hover:bg-slate-300"}`}
                  >
                    <PlusIcon className="h-6 w-6" />
                    Create New Classroom
                  </button>
                )}
              </section>

              <div className="min-h-0 space-y-5 overflow-hidden">
                <UpcomingPanel />
                <RecentActivityPanel classrooms={classrooms} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
