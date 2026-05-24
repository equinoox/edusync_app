import { auth, clerkClient } from '@clerk/nextjs/server';

import { isUserRole, type UserRole } from '@/features/auth/types';

export async function getCurrentUserWithRole() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role;

  if (!isUserRole(role)) {
    throw new Error('User role is required');
  }

  return { userId, role };
}

export async function requireCurrentUserRole(requiredRole: UserRole) {
  const currentUser = await getCurrentUserWithRole();

  if (currentUser.role !== requiredRole) {
    throw new Error('Forbidden');
  }

  return currentUser;
}
