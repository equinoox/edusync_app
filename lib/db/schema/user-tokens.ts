import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { nanoid } from "@/lib/utils";

export const userTokensTable = pgTable("user_tokens", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: varchar("user_id", { length: 191 }).unique().notNull(),
  messagesUsed: integer("messages_used").default(0).notNull(),
  lastResetAt: timestamp("last_reset_at").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});
