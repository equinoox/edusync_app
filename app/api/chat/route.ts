import type { UIMessage } from 'ai';
import { auth } from '@clerk/nextjs/server';

import { createChatResponse } from '@/features/chat/server/chat.service';
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

    // Get the user's latest message - extract text from parts or content
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return new Response(
        JSON.stringify({ error: 'No message provided' }),
        { status: 400 }
      );
    }

    let messageText = '';
    
    // Handle messages that have parts array (from useChat hook)
    if (Array.isArray((lastMessage as any).parts)) {
      const textParts = (lastMessage as any).parts.filter((part: any) => part.type === 'text');
      messageText = textParts.map((part: any) => part.text).join('');
    } 
    // Handle messages with content property
    else if (typeof (lastMessage as any).content === 'string') {
      messageText = (lastMessage as any).content;
    }

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

    const result = await createChatResponse(messages, documentId ?? undefined);

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
