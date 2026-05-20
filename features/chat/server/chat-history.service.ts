import type { UIMessage } from 'ai';
import { db } from "@/lib/db";
import { chatSessionsTable, chatMessagesTable } from "@/lib/db/schema/chat-history";
import { eq, desc, and } from "drizzle-orm";
import { ChatSession, ChatMessage, ChatSessionWithMessages } from "../types";

export async function createChatSession(
  userId: string,
  initialMessage: string
): Promise<ChatSession> {
  const title = buildSessionTitle(initialMessage);
  const preview = buildSessionPreview(initialMessage);

  const sessions = await db
    .insert(chatSessionsTable)
    .values({
      userId,
      title,
      preview,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return sessions[0];
}

export async function createChatSessionWithMetadata(
  userId: string,
  initialMessage: string,
  preview?: string
): Promise<ChatSession> {
  const title = buildSessionTitle(initialMessage);
  const sessionPreview = preview?.trim() || buildSessionPreview(initialMessage);

  const sessions = await db
    .insert(chatSessionsTable)
    .values({
      userId,
      title,
      preview: sessionPreview,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return sessions[0];
}

export async function saveMessage(
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<ChatMessage> {
  const messages = await db
    .insert(chatMessagesTable)
    .values({
      sessionId,
      userId,
      role,
      content,
      createdAt: new Date(),
    })
    .returning();

  return {
    ...messages[0],
    role: messages[0].role as 'user' | 'assistant',
  };
}

export async function saveLatestChatTurn(
  sessionId: string,
  userId: string,
  messages: UIMessage[]
): Promise<{ session: ChatSessionWithMessages | null; saved: number }> {
  const session = await getChatSession(sessionId, userId);

  if (!session) {
    return { session: null, saved: 0 };
  }

  if (messages.length <= session.messages.length) {
    return { session, saved: 0 };
  }

  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant');

  let saved = 0;

  if (latestUserMessage) {
    await saveMessage(
      sessionId,
      userId,
      'user',
      extractMessageText(latestUserMessage)
    );
    saved += 1;
  }

  if (latestAssistantMessage) {
    await saveMessage(
      sessionId,
      userId,
      'assistant',
      extractMessageText(latestAssistantMessage)
    );
    saved += 1;
  }

  const userText = latestUserMessage ? extractMessageText(latestUserMessage) : '';
  await updateSessionMetadata(
    sessionId,
    userId,
    userText ? buildSessionTitle(userText) : session.title,
    userText ? buildSessionPreview(userText) : session.preview ?? null
  );

  const refreshedSession = await getChatSession(sessionId, userId);
  return { session: refreshedSession, saved };
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  const sessions = await db
    .select()
    .from(chatSessionsTable)
    .where(eq(chatSessionsTable.userId, userId))
    .orderBy(desc(chatSessionsTable.updatedAt));

  return sessions;
}

export async function getChatSession(
  sessionId: string,
  userId: string
): Promise<ChatSessionWithMessages | null> {
  const sessions = await db
    .select()
    .from(chatSessionsTable)
    .where(
      and(
        eq(chatSessionsTable.id, sessionId),
        eq(chatSessionsTable.userId, userId)
      )
    )
    .limit(1);

  if (sessions.length === 0) return null;

  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sessionId))
    .orderBy(chatMessagesTable.createdAt);

  return {
    ...sessions[0],
    messages: messages.map(msg => ({
      ...msg,
      role: msg.role as 'user' | 'assistant',
    })),
  };
}

export async function updateSessionTitle(
  sessionId: string,
  userId: string,
  title: string
): Promise<void> {
  await db
    .update(chatSessionsTable)
    .set({
      title,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(chatSessionsTable.id, sessionId),
        eq(chatSessionsTable.userId, userId)
      )
    );
}

  export async function updateSessionMetadata(
    sessionId: string,
    userId: string,
    title: string,
    preview: string | null
  ): Promise<void> {
    await db
      .update(chatSessionsTable)
      .set({
        title,
        preview,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(chatSessionsTable.id, sessionId),
          eq(chatSessionsTable.userId, userId)
        )
      );
  }

export async function deleteChatSession(
  sessionId: string,
  userId: string
): Promise<void> {
  // Delete messages first
  await db
    .delete(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sessionId));

  // Delete session
  await db
    .delete(chatSessionsTable)
    .where(
      and(
        eq(chatSessionsTable.id, sessionId),
        eq(chatSessionsTable.userId, userId)
      )
    );
}

export async function updateSessionTimestamp(sessionId: string): Promise<void> {
  await db
    .update(chatSessionsTable)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(chatSessionsTable.id, sessionId));
}

function buildSessionTitle(message: string): string {
  return message.substring(0, 50) + (message.length > 50 ? "..." : "");
}

function buildSessionPreview(message: string): string {
  return message.substring(0, 100);
}

function extractMessageText(message: UIMessage): string {
  const messageWithParts = message as UIMessage & {
    parts?: Array<{ type?: string; text?: string }>;
    content?: string;
  };

  if (Array.isArray(messageWithParts.parts)) {
    return messageWithParts.parts
      .filter((part: any) => part?.type === 'text' && typeof part?.text === 'string')
      .map((part: any) => part.text ?? '')
      .join('')
      .trim();
  }

  if (typeof messageWithParts.content === 'string') {
    return messageWithParts.content.trim();
  }

  return '';
}
