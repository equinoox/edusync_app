export const USER_ROLES = ['student', 'professor'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && USER_ROLES.includes(value as UserRole);

export type RoleSelectionModalProps = {
  isSubmitting: boolean;
  error: string | null;
  onSelectRole: (role: UserRole, professorKey?: string) => Promise<void>;
};

export type ClerkUserProfile = {
  id: string;
  fullName: string | null;
  email: string | null;
  imageUrl: string | null;
};
