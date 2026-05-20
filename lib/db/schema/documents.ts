import { sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from '@/lib/utils';
import { resources } from '@/lib/db/schema/resources';

export const documents = pgTable('documents', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  userId: varchar('user_id', { length: 191 }).notNull(),
  resourceId: varchar('resource_id', { length: 191 })
    .notNull()
    .references(() => resources.id, { onDelete: 'cascade' }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size').notNull(),
  fileUrl: text('file_url').notNull(),
  pageCount: integer('page_count').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
});