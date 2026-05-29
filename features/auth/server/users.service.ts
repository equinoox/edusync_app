import { clerkClient } from '@clerk/nextjs/server';

import type { ClerkUserProfile } from '@/features/auth/types';

export async function getUsersByIds(userIds: string[]) {
  const uniqueUserIds = Array.from(new Set(userIds)).filter(Boolean);

  if (uniqueUserIds.length === 0) {
    return new Map<string, ClerkUserProfile>();
  }

  const client = await clerkClient();
  const response = await client.users.getUserList({
    userId: uniqueUserIds,
    limit: uniqueUserIds.length,
  });

  return new Map(
    response.data.map(user => [
      user.id,
      {
        id: user.id,
        fullName:
          user.fullName ??
          [user.firstName, user.lastName].filter(Boolean).join(' ') ??
          null,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        imageUrl: user.imageUrl ?? null,
      },
    ]),
  );
}
