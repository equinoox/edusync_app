'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  PlusIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

import Sidebar from '@/components/layout/sidebar';
import SmallBar from '@/components/layout/SmallBar';
import TopBar from '@/components/layout/TopBar';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { QuickActionsPanel } from '@/components/shared/QuickActionsPanel';
import { RecentActivityPanel, type RecentActivityItem } from '@/components/shared/RecentActivityPanel';
import {
  ToastNotification,
  type ToastNotificationState,
} from '@/components/shared/ToastNotification';
import { ViewAllModal } from '@/components/shared/ViewAllModal';
import type { ClassroomListItem } from '@/features/classrooms/types';
import {
  createQuizAction,
  deleteQuizAction,
} from '@/features/quizzes/actions/quizzes.action';
import { CreateQuestionModal } from '@/features/quizzes/components/CreateQuestionModal';
import { CreateQuizModal } from '@/features/quizzes/components/CreateQuizModal';
import { QuizCard, type QuizCardItem } from '@/features/quizzes/components/QuizCard';
import { QuizDetailsModal } from '@/features/quizzes/components/QuizDetailsModal';
import { QuizzesDashboardHeader } from '@/features/quizzes/components/QuizzesDashboardHeader';
import { TakeQuizModal } from '@/features/quizzes/components/TakeQuizModal';
import type {
  CreateQuizInput,
  QuizAttempt,
  QuizForEditing,
  QuizForTaking,
  QuizListItem,
} from '@/features/quizzes/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';

type SortOrder = 'desc' | 'asc';
type FilterMode = 'all' | 'classroom' | 'general' | 'completed';

function QuizStatCard({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: number | string;
  Icon: typeof DocumentCheckIcon;
  tone: 'violet' | 'green' | 'blue' | 'orange';
}) {
  const { darkMode } = useTheme();
  const toneClass = {
    violet: darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-500/15 text-violet-700',
    green: darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-500/15 text-green-700',
    blue: darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500/15 text-blue-700',
    orange: darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-500/15 text-orange-700',
  }[tone];

  return (
    <article className={`rounded-xl border p-4 shadow-md ${darkMode ? 'border-white/5 bg-slate-800' : 'border-slate-500 bg-slate-400'}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <p className={`text-2xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-slate-950'}`}>
            {value}
          </p>
          <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {label}
          </p>
        </div>
      </div>
    </article>
  );
}

const isQuizDetails = (
  value: QuizForEditing | QuizForTaking | { error?: string },
): value is QuizForEditing | QuizForTaking =>
  'questions' in value && Array.isArray(value.questions);

export function QuizzesPage() {
  const { darkMode } = useTheme();
  const { isLoaded, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<QuizCardItem[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomListItem[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [toast, setToast] = useState<ToastNotificationState | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [quizToCreate, setQuizToCreate] = useState<CreateQuizInput | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<QuizCardItem | null>(null);
  const [quizForQuestions, setQuizForQuestions] = useState<QuizListItem | null>(null);
  const [quizForDetails, setQuizForDetails] = useState<QuizCardItem | null>(null);
  const [quizForTaking, setQuizForTaking] = useState<QuizCardItem | null>(null);
  const [activityItems, setActivityItems] = useState<RecentActivityItem[]>([]);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [handledQueryQuizId, setHandledQueryQuizId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const role = user?.publicMetadata?.role;
  const isProfessor = role === 'professor';

  const showToast = useCallback((message: string, tone: ToastNotificationState['tone'] = 'info') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const loadQuizzes = useCallback(async (options?: { quiet?: boolean }) => {
    if (!isLoaded || !role) return;

    if (!options?.quiet) setIsLoading(true);

    try {
      const [quizResponse, classroomResponse, attemptResponse] = await Promise.all([
        fetch('/api/quizzes'),
        fetch('/api/classrooms'),
        role === 'student' ? fetch('/api/quizzes/attempts') : Promise.resolve(null),
      ]);

      const quizData = await quizResponse.json();
      const classroomData = await classroomResponse.json();
      const attemptData = attemptResponse ? await attemptResponse.json() : [];

      if (!quizResponse.ok) throw new Error(quizData.error ?? 'Something went wrong');
      if (!classroomResponse.ok) throw new Error(classroomData.error ?? 'Something went wrong');
      if (attemptResponse && !attemptResponse.ok) {
        throw new Error(attemptData.error ?? 'Something went wrong');
      }

      const loadedClassrooms = (classroomData.classrooms ?? []) as ClassroomListItem[];
      const attemptList = (Array.isArray(attemptData) ? attemptData : []) as QuizAttempt[];
      const classroomTitleById = new Map(
        loadedClassrooms.map((classroom: ClassroomListItem) => [classroom.id, classroom.title]),
      );
      const attemptByQuizId = new Map(
        attemptList.map((attempt: QuizAttempt) => [attempt.quizId, attempt]),
      );

      const quizzesWithCounts = await Promise.all(
        (quizData as QuizListItem[]).map(async quiz => {
          const detailsResponse = await fetch(`/api/quizzes/${quiz.id}`);

          if (!detailsResponse.ok) {
            return {
              ...quiz,
              questionCount: 0,
              classroomTitle: quiz.classroomId ? classroomTitleById.get(quiz.classroomId) ?? null : null,
              attempt: attemptByQuizId.get(quiz.id) ?? null,
            };
          }

          const details = await detailsResponse.json();

          return {
            ...quiz,
            questionCount: isQuizDetails(details) ? details.questions.length : 0,
            classroomTitle: quiz.classroomId ? classroomTitleById.get(quiz.classroomId) ?? null : null,
            attempt: attemptByQuizId.get(quiz.id) ?? null,
          };
        }),
      );

      setClassrooms(loadedClassrooms);
      setAttempts(attemptList);
      setQuizzes(quizzesWithCounts);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, role, showToast]);

  useEffect(() => {
    void loadQuizzes();
  }, [loadQuizzes]);

  useEffect(() => {
    if (typeof window === 'undefined' || quizzes.length === 0 || handledQueryQuizId) {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const queryQuizId = searchParams.get('take') ?? searchParams.get('quizId');

    if (!queryQuizId) {
      return;
    }

    const queryQuiz = quizzes.find(quiz => quiz.id === queryQuizId);

    if (!queryQuiz) {
      return;
    }

    setHandledQueryQuizId(queryQuizId);

    if (isProfessor) {
      setQuizForDetails(queryQuiz);
      return;
    }

    setQuizForTaking(queryQuiz);
  }, [handledQueryQuizId, isProfessor, quizzes]);

  const filteredQuizzes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return quizzes
      .filter(quiz => {
        if (filterMode === 'classroom' && !quiz.classroomId) return false;
        if (filterMode === 'general' && quiz.classroomId) return false;
        if (filterMode === 'completed' && quiz.attempt?.status !== 'submitted') return false;
        if (!normalizedSearch) return true;

        return (
          quiz.title.toLowerCase().includes(normalizedSearch) ||
          quiz.description.toLowerCase().includes(normalizedSearch) ||
          quiz.classroomTitle?.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((first, second) => {
        const firstDate = new Date(first.createdAt).getTime();
        const secondDate = new Date(second.createdAt).getTime();
        return sortOrder === 'desc' ? secondDate - firstDate : firstDate - secondDate;
      });
  }, [filterMode, quizzes, search, sortOrder]);

  const completedAttempts = attempts.filter(attempt => attempt.status === 'submitted');
  const averageScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce((total, attempt) => total + attempt.accuracyPercent, 0) /
            completedAttempts.length,
        )
      : 0;

  const recentActivity = useMemo<RecentActivityItem[]>(
    () => [
      ...activityItems,
      ...quizzes.map(quiz => ({
        id: `quiz-${quiz.id}`,
        title: quiz.attempt?.status === 'submitted'
          ? `You completed ${quiz.title}`
          : `${quiz.title} is available`,
        description: quiz.classroomTitle ?? (quiz.classroomId ? 'Classroom quiz' : 'General quiz'),
        timestamp: quiz.updatedAt,
        Icon: ClipboardDocumentListIcon,
      })),
    ],
    [activityItems, quizzes],
  );

  const quickActions = useMemo(
    () =>
      isProfessor
        ? [
            {
              id: 'create',
              label: 'Create Quiz',
              Icon: PlusIcon,
              onClick: () => setIsCreateModalOpen(true),
            },
            {
              id: 'question-bank',
              label: 'Browse Question Banks',
              Icon: ClipboardDocumentListIcon,
              onClick: () => showToast('Question banks are coming soon', 'info'),
            },
            {
              id: 'import',
              label: 'Import Questions',
              Icon: ArrowPathIcon,
              onClick: () => showToast('Import flow is coming soon', 'info'),
            },
          ]
        : [
            {
              id: 'available',
              label: 'Available Quizzes',
              Icon: ClipboardDocumentListIcon,
              onClick: () => setFilterMode('all'),
            },
            {
              id: 'completed',
              label: 'Completed Quizzes',
              Icon: CheckCircleIcon,
              onClick: () => setFilterMode('completed'),
            },
            {
              id: 'assistant',
              label: 'Ask AI Assistant',
              href: '/chat',
              Icon: SparklesIcon,
            },
          ],
    [isProfessor, showToast],
  );

  const handleCreateQuiz = () => {
    if (!quizToCreate) return;

    setCreateError(null);
    startTransition(async () => {
      const result = await createQuizAction(quizToCreate);

      if (typeof result === 'string') {
        setCreateError(result);
        setQuizToCreate(null);
        return;
      }

      setQuizToCreate(null);
      setIsCreateModalOpen(false);
      setQuizForQuestions(result);
      setActivityItems(previous => [
        {
          id: `created-${result.id}-${Date.now()}`,
          title: `Quiz created: ${result.title}`,
          timestamp: new Date(),
          Icon: ClipboardDocumentListIcon,
        },
        ...previous,
      ]);
      showToast('Quiz created', 'success');
      await loadQuizzes({ quiet: true });
    });
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;

    setIsDeleting(true);
    const result = await deleteQuizAction(quizToDelete.id);
    setIsDeleting(false);

    if (typeof result === 'string') {
      showToast(result, 'error');
      return;
    }

    showToast('Quiz deleted', 'success');
    setQuizToDelete(null);
    await loadQuizzes({ quiet: true });
  };

  const handleQuestionAdded = () => {
    if (quizForQuestions) {
      setActivityItems(previous => [
        {
          id: `question-${quizForQuestions.id}-${Date.now()}`,
          title: `Question added to ${quizForQuestions.title}`,
          timestamp: new Date(),
          Icon: ClipboardDocumentListIcon,
        },
        ...previous,
      ]);
    }
    void loadQuizzes({ quiet: true });
  };

  return (
    <main className={cn('flex h-screen overflow-hidden transition-colors duration-300', darkMode ? 'bg-slate-950' : 'bg-slate-200')}>
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
      <CreateQuizModal
        isOpen={isCreateModalOpen}
        isSaving={isPending}
        classrooms={classrooms}
        error={createError}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={setQuizToCreate}
      />
      <CreateQuestionModal
        quiz={quizForQuestions}
        isOpen={Boolean(quizForQuestions)}
        onClose={() => setQuizForQuestions(null)}
        onQuestionAdded={handleQuestionAdded}
        onToast={showToast}
      />
      <QuizDetailsModal
        quiz={quizForDetails}
        isOpen={Boolean(quizForDetails)}
        onClose={() => setQuizForDetails(null)}
        onChanged={() => void loadQuizzes({ quiet: true })}
        onAddQuestion={quiz => {
          setQuizForDetails(null);
          setQuizForQuestions(quiz);
        }}
        onToast={showToast}
      />
      <TakeQuizModal
        quiz={quizForTaking}
        isOpen={Boolean(quizForTaking)}
        onClose={() => setQuizForTaking(null)}
        onSubmitted={() => void loadQuizzes({ quiet: true })}
        onToast={showToast}
      />
      <ViewAllModal
        isOpen={isActivityModalOpen}
        title="All Quiz Activity"
        items={recentActivity}
        emptyMessage="No quiz activity yet."
        onClose={() => setIsActivityModalOpen(false)}
        renderItem={item => {
          const Icon = item.Icon ?? ClipboardDocumentListIcon;

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
      <ConfirmationModal
        isOpen={Boolean(quizToCreate)}
        isLoading={isPending}
        message="Are you sure you want to create this quiz?"
        loadingLabel="Creating..."
        onCancel={() => setQuizToCreate(null)}
        onConfirm={handleCreateQuiz}
      />
      <ConfirmationModal
        isOpen={Boolean(quizToDelete)}
        isLoading={isDeleting}
        message="Are you sure you want to delete this quiz?"
        loadingLabel="Deleting..."
        onCancel={() => setQuizToDelete(null)}
        onConfirm={handleDeleteQuiz}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={cn('fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <Sidebar sidebarOpen={sidebarOpen} />
      </div>

      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <SmallBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          actions={
            isProfessor ? (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex h-9 items-center gap-1 rounded-lg bg-violet-600 px-3 text-sm font-bold text-white"
              >
                <PlusIcon className="h-4 w-4" />
                Quiz
              </button>
            ) : undefined
          }
        />

        <div className="hidden lg:block">
          <TopBar pageName="Quizzes" />
        </div>

        <div className="min-h-0 flex-1 p-3 sm:p-4 lg:p-5">
          <div className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border p-4 sm:p-5 ${darkMode ? 'border-white/5 bg-slate-900' : 'border-slate-500 bg-slate-300'}`}>
            <QuizzesDashboardHeader
              isProfessor={isProfessor}
              search={search}
              sortOrder={sortOrder}
              onSearchChange={setSearch}
              onSortOrderChange={setSortOrder}
              onCreateQuiz={() => setIsCreateModalOpen(true)}
            />

            <div className="mt-7 grid shrink-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <QuizStatCard Icon={ClipboardDocumentListIcon} label="Total Quizzes" value={quizzes.length} tone="violet" />
              <QuizStatCard Icon={DocumentCheckIcon} label="Classroom Quizzes" value={quizzes.filter(quiz => quiz.classroomId).length} tone="blue" />
              <QuizStatCard Icon={SparklesIcon} label="General Quizzes" value={quizzes.filter(quiz => !quiz.classroomId).length} tone="orange" />
              <QuizStatCard Icon={CheckCircleIcon} label={isProfessor ? 'Questions Added' : 'Average Score'} value={isProfessor ? quizzes.reduce((total, quiz) => total + quiz.questionCount, 0) : `${averageScore}%`} tone="green" />
            </div>

            <div className="mt-6 grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
              <section className="flex min-h-0 min-w-0 flex-col">
                <div className="mb-3 flex h-5 shrink-0 justify-end">
                  {isLoading && (
                    <span
                      className={`inline-flex h-5 w-5 animate-spin rounded-full border-2 border-t-transparent ${darkMode ? 'border-violet-300' : 'border-violet-700'}`}
                      aria-label="Loading quizzes"
                    />
                  )}
                </div>

                {isLoading && quizzes.length === 0 ? (
                  <div className={`flex min-h-48 items-center justify-center rounded-xl border border-dashed ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-500 bg-slate-400'}`}>
                    <span className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${darkMode ? 'border-violet-300' : 'border-violet-700'}`} />
                  </div>
                ) : filteredQuizzes.length > 0 ? (
                  <div className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border shadow-md ${darkMode ? 'border-white/5 bg-slate-800/60' : 'border-slate-500 bg-slate-400'}`}>
                    <div className={`flex shrink-0 gap-8 border-b px-5 pt-4 ${darkMode ? 'border-white/5' : 'border-slate-500'}`}>
                      {(['all', 'classroom', 'general', 'completed'] as const).map(mode => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setFilterMode(mode)}
                          className={`border-b-2 pb-3 text-sm font-semibold capitalize transition ${
                            filterMode === mode
                              ? darkMode
                                ? 'border-violet-400 text-violet-300'
                                : 'border-violet-700 text-violet-700'
                              : darkMode
                                ? 'border-transparent text-slate-400 hover:text-slate-200'
                                : 'border-transparent text-slate-700 hover:text-slate-950'
                          }`}
                        >
                          {mode === 'all' ? 'All Quizzes' : mode}
                        </button>
                      ))}
                    </div>

                    <div className="min-h-0 flex-1 overflow-x-auto">
                      <div className="flex min-h-full min-w-[820px] flex-col">
                        <div className={`grid grid-cols-[minmax(220px,1.7fr)_minmax(180px,1.15fr)_110px_130px_120px_110px_44px] gap-4 border-b px-5 py-4 text-xs font-semibold ${darkMode ? 'border-white/5 text-slate-400' : 'border-slate-500 text-slate-700'}`}>
                          <span>Quiz</span>
                          <span>Classroom</span>
                          <span className="text-center">Questions</span>
                          <span className="text-center">Time / Points</span>
                          <span className="text-center">Status</span>
                          <span className="text-center">Score</span>
                          <span className="text-right" />
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                          {filteredQuizzes.map(quiz => (
                            <QuizCard
                              key={quiz.id}
                              quiz={quiz}
                              isProfessor={isProfessor}
                              onManage={setQuizForDetails}
                              onTake={setQuizForTaking}
                              onDelete={setQuizToDelete}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-xl border border-dashed px-5 py-12 text-center ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-500 bg-slate-400'}`}>
                    <ClipboardDocumentListIcon className={`mx-auto h-10 w-10 ${darkMode ? 'text-violet-300' : 'text-violet-700'}`} />
                    <h3 className={`mt-3 font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                      No quizzes found
                    </h3>
                    <p className={`mx-auto mt-1 max-w-md text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {isProfessor
                        ? 'Create a quiz and add questions to get started.'
                        : 'Available quizzes will appear here.'}
                    </p>
                  </div>
                )}
              </section>

              <div className="min-h-0 space-y-5 overflow-y-auto pr-1">
                <RecentActivityPanel
                  title="Recent Activity"
                  emptyMessage="No quiz activity yet."
                  items={recentActivity}
                  previewLimit={5}
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
