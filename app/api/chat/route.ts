import type { UIMessage } from 'ai';
import { auth } from '@clerk/nextjs/server';

import { createChatResponse } from '@/features/chat/server/chat.service';
import { getUserDocumentById } from '@/features/documents/repositories/documents.repository';
import {
  getTextFromMessage,
  saveChatMessage,
} from '@/features/chat/server/chat-history.service';
import { 
  checkAndIncrementTokenUsage, 
  validateMessageLength 
} from '@/features/tokens/server/token-limit.service';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const {
      messages,
      documentId,
    }: { messages: UIMessage[]; documentId?: string | null } = await req.json();
    const selectedDocument = documentId
      ? await getUserDocumentById(documentId, userId)
      : undefined;

    if (documentId && !selectedDocument) {
      return new Response(
        JSON.stringify({ error: 'Selected document was not found' }),
        { status: 404 },
      );
    }

    // Get the user's latest message - extract text from parts or content
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return new Response(
        JSON.stringify({ error: 'No message provided' }),
        { status: 400 }
      );
    }

    const messageText = getTextFromMessage(lastMessage);

    if (!messageText || typeof messageText !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        { status: 400 }
      );
    }

    // Validate message length
    const lengthValidation = await validateMessageLength(messageText);
    if (!lengthValidation.valid) {
      return new Response(
        JSON.stringify({ error: lengthValidation.error }),
        { status: 400 }
      );
    }

    // Check and increment token usage
    const tokenCheck = await checkAndIncrementTokenUsage(userId);
    if (!tokenCheck.canProceed) {
      return new Response(
        JSON.stringify({ error: tokenCheck.error }),
        { status: 429 }
      );
    }

    await saveChatMessage({
      userId,
      role: 'user',
      content: messageText,
    });

    const result = await createChatResponse(
      messages,
      selectedDocument
        ? {
            id: selectedDocument.id,
            fileName: selectedDocument.fileName,
          }
        : undefined,
      async text => {
        await saveChatMessage({
          userId,
          role: 'assistant',
          content: text,
        });
      },
    );

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
