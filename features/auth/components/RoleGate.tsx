'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import { RoleSelectionModal } from '@/features/auth/components/RoleSelectionModal';
import { isUserRole, type UserRole } from '@/features/auth/types';

const publicRoutes = ['/', '/sign-in', '/sign-up'];

const isPublicPath = (pathname: string) =>
  publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

export function RoleGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const [roleOverride, setRoleOverride] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const role = roleOverride ?? user?.publicMetadata?.role;
  const hasRole = isUserRole(role);
  const shouldBlock =
    isLoaded &&
    isSignedIn &&
    !hasRole &&
    !isPublicPath(pathname);

  const handleSelectRole = async (selectedRole: UserRole, professorKey?: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedRole,
          professorKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Something went wrong');
      }

      setRoleOverride(data.role);
      await user?.reload();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (shouldBlock) {
    return (
      <RoleSelectionModal
        isSubmitting={isSubmitting}
        error={error}
        onSelectRole={handleSelectRole}
      />
    );
  }

  return <>{children}</>;
}
