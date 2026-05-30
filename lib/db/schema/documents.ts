import { sql } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from '@/lib/utils';

export const documents = pgTable(
  'documents',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    userId: varchar('user_id', { length: 191 }).notNull(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileType: varchar('file_type', { length: 100 }).notNull().default('application/pdf'),
    fileSize: integer('file_size').notNull(),
    fileUrl: text('file_url').notNull(),
    storageKey: text('storage_key'),
    pageCount: integer('page_count').notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
  },
  table => ({
    documentUserCreatedAtIdx: index('document_user_created_at_idx').on(
      table.userId,
      table.createdAt,
    ),
  }),
);
