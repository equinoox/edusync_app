import type { ComponentType } from 'react';
import type { UserRole } from '@/features/auth/types';

export interface TopBarProps {
  displayName: string;
}

export interface HeroSectionProps {
  firstName: string;
}

export type HomeNewsArticle = {
  id: number;
  title: string;
  description: string;
  image: string;
  body: string;
};

export type ArticleModalProps = {
  article: HomeNewsArticle | null;
  onClose: () => void;
};

export type HomeQuickActionsProps = {
  role?: UserRole | null;
};

export type HomeQuickAction = {
  id: string;
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
};

export type StickyColor = 'yellow' | 'blue' | 'green' | 'pink';
export type HomeClassroomIcon = 'function' | 'flask' | 'monitor' | 'book';

export interface HomeClassroom {
  id: string;
  name: string;
  sub: string;
  quizzes: number;
  progress: number;
  icon: HomeClassroomIcon;
  color: StickyColor;
}

export type StickyStyle = {
  bg: string;
  text: string;
  muted: string;
  rotate: string;
};
