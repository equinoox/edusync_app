import { deleteDocument } from '@/features/documents/server/documents.service';

type RouteParams = {
  params: Promise<{
    documentId: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { documentId } = await params;
    await deleteDocument(documentId);

    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    const status = message === 'Unauthorized' ? 401 : message === 'Document not found' ? 404 : 400;

    return Response.json({ error: message }, { status });
  }
}
