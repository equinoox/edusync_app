import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { nanoid } from "@/lib/utils";
import { relations } from "drizzle-orm";

export const chatSessionsTable = pgTable("chat_sessions", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: varchar("user_id", { length: 191 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  preview: text("preview"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const chatMessagesTable = pgTable("chat_messages", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  sessionId: varchar("session_id", { length: 191 }).notNull(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
});

export const chatSessionsRelations = relations(
  chatSessionsTable,
  ({ many }) => ({
    messages: many(chatMessagesTable),
  })
);

export const chatMessagesRelations = relations(
  chatMessagesTable,
  ({ one }) => ({
    session: one(chatSessionsTable, {
      fields: [chatMessagesTable.sessionId],
      references: [chatSessionsTable.id],
    }),
  })
);
