import { sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { nanoid } from '@/lib/utils';

export const chatMessages = pgTable(
  'chat_messages',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    userId: varchar('user_id', { length: 191 }).notNull(),
    role: varchar('role', { length: 32 }).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
  },
  table => ({
    chatMessageUserCreatedAtIdx: index('chat_message_user_created_at_idx').on(
      table.userId,
      table.createdAt,
    ),
  }),
);
