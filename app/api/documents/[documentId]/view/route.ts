import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema/documents';

type RouteParams = {
  params: Promise<{
    documentId: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { documentId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const [document] = await db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.id, documentId),
        eq(documents.userId, userId),
      ),
    )
    .limit(1);

  if (!document) {
    return new Response('Document not found', { status: 404 });
  }

  if (!document.fileUrl) {
    return new Response('PDF file is not available for this document', {
      status: 404,
    });
  }

  return Response.redirect(document.fileUrl);
}