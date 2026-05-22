import { uploadDocument } from '@/features/documents/server/documents.service';
import { auth } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(file instanceof File)) {
      return Response.json({ error: 'PDF file is required' }, { status: 400 });
    }

    const blob = await put(`documents/${userId}/${file.name}`, file, {
      access: 'public',
    });

    const result = await uploadDocument(file, {
      fileUrl: blob.url,
      storageKey: blob.pathname,
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 },
    );
  }
}
