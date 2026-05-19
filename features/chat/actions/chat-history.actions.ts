'use server';

import { auth } from "@clerk/nextjs/server";
import {
  getChatSessions,
  getChatSession,
  deleteChatSession,
  updateSessionTitle,
} from "../server/chat-history.service";

export async function getSessions() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return getChatSessions(userId);
}

export async function getSession(sessionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return getChatSession(sessionId, userId);
}

export async function deleteSession(sessionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await deleteChatSession(sessionId, userId);
}

export async function renameSession(sessionId: string, title: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await updateSessionTitle(sessionId, userId, title);
}
