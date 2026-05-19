import { db } from "@/lib/db";
import { userTokensTable } from "@/lib/db/schema/user-tokens";
import { eq } from "drizzle-orm";
import { TokenStatus, TokenLimit, DEFAULT_TOKEN_LIMITS } from "../types";

export async function getTokenStatus(userId: string): Promise<TokenStatus> {
  const record = await db
    .select()
    .from(userTokensTable)
    .where(eq(userTokensTable.userId, userId))
    .limit(1);

  const userToken = record[0];
  const now = new Date();

  if (!userToken) {
    // Create new token record for first-time user
    const newRecord = await db
      .insert(userTokensTable)
      .values({
        userId,
        messagesUsed: 0,
        lastResetAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return calculateTokenStatus(newRecord[0], now);
  }

  // Check if 24 hours have passed since last reset
  const timeSinceReset = now.getTime() - userToken.lastResetAt.getTime();
  const hoursSinceReset = timeSinceReset / (1000 * 60 * 60);

  let currentRecord = userToken;
  if (hoursSinceReset >= 24) {
    // Reset the token count
    currentRecord = await db
      .update(userTokensTable)
      .set({
        messagesUsed: 0,
        lastResetAt: now,
        updatedAt: now,
      })
      .where(eq(userTokensTable.userId, userId))
      .returning()
      .then((rows) => rows[0]);
  }

  return calculateTokenStatus(currentRecord, now);
}

export async function validateMessageLength(
  messageContent: string
): Promise<{ valid: boolean; error?: string }> {
  const charCount = messageContent.trim().length;

  if (charCount === 0) {
    return { valid: false, error: "Message cannot be empty" };
  }

  if (charCount > DEFAULT_TOKEN_LIMITS.maxCharactersPerMessage) {
    return {
      valid: false,
      error: `Message exceeds ${DEFAULT_TOKEN_LIMITS.maxCharactersPerMessage} character limit (current: ${charCount})`,
    };
  }

  return { valid: true };
}

export async function checkAndIncrementTokenUsage(
  userId: string
): Promise<{ canProceed: boolean; status?: TokenStatus; error?: string }> {
  const status = await getTokenStatus(userId);

  if (status.isLimited) {
    return {
      canProceed: false,
      error: `Message limit reached. ${Math.ceil(status.hoursUntilReset)} hours until reset.`,
    };
  }

  // Increment usage
  await db
    .update(userTokensTable)
    .set({
      messagesUsed: status.messagesUsed + 1,
      updatedAt: new Date(),
    })
    .where(eq(userTokensTable.userId, userId));

  // Get updated status
  const updatedStatus = await getTokenStatus(userId);
  return { canProceed: true, status: updatedStatus };
}

function calculateTokenStatus(
  record: any,
  now: Date
): TokenStatus {
  const timeSinceReset = now.getTime() - record.lastResetAt.getTime();
  const hoursUntilReset = Math.max(0, 24 - timeSinceReset / (1000 * 60 * 60));
  const messagesRemaining = Math.max(
    0,
    DEFAULT_TOKEN_LIMITS.maxMessagesPerDay - record.messagesUsed
  );

  return {
    messagesUsed: record.messagesUsed,
    messageLimit: DEFAULT_TOKEN_LIMITS.maxMessagesPerDay,
    messagesRemaining,
    lastResetAt: record.lastResetAt,
    hoursUntilReset,
    isLimited: record.messagesUsed >= DEFAULT_TOKEN_LIMITS.maxMessagesPerDay,
  };
}
