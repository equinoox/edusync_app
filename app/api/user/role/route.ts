import { auth, clerkClient } from '@clerk/nextjs/server';
import { z } from 'zod';

import { env } from '@/lib/env.mjs';
import { isUserRole } from '@/features/auth/types';

const roleSchema = z.object({
  role: z.enum(['student', 'professor']),
  professorKey: z.string().optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedBody = roleSchema.safeParse(await request.json());

  if (!parsedBody.success || !isUserRole(parsedBody.data.role)) {
    return Response.json({ error: 'Invalid role' }, { status: 400 });
  }

  const { role, professorKey } = parsedBody.data;

  if (role === 'professor' && professorKey !== env.PROFESSOR_MASTER_KEY) {
    return Response.json({ error: 'Invalid professor key' }, { status: 403 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  await client.users.updateUser(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      role,
    },
  });

  return Response.json({ role });
}
