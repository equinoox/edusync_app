export interface TokenStatus {
  messagesUsed: number;
  messageLimit: number;
  messagesRemaining: number;
  lastResetAt: Date;
  hoursUntilReset: number;
  isLimited: boolean;
}

export interface TokenLimit {
  maxMessagesPerDay: number;
  maxCharactersPerMessage: number;
}

export const DEFAULT_TOKEN_LIMITS: TokenLimit = {
  maxMessagesPerDay: 15,
  maxCharactersPerMessage: 15000,
};
