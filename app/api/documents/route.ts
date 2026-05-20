import { auth } from '@clerk/nextjs/server';

import { getUserDocuments } from '@/features/documents/repositories/documents.repository';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json(await getUserDocuments(userId));
}
