import { sql } from "drizzle-orm";
import { index, integer, text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { nanoid } from "@/lib/utils";
import { documents } from "@/lib/db/schema/documents";

export const resources = pgTable(
  "resources",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: varchar("user_id", { length: 191 }).notNull(),
    documentId: varchar("document_id", { length: 191 }).references(
      () => documents.id,
      { onDelete: "cascade" },
    ),
    content: text("content").notNull(),
    pageNumber: integer("page_number"),
    chunkIndex: integer("chunk_index"),
    contentType: varchar("content_type", { length: 20 }),

    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`now()`),
  },
  table => ({
    resourceUserDocumentChunkIdx: index("resource_user_document_chunk_idx").on(
      table.userId,
      table.documentId,
      table.chunkIndex,
    ),
    resourceDocumentCreatedAtIdx: index("resource_document_created_at_idx").on(
      table.documentId,
      table.createdAt,
    ),
  }),
);

// Schema for resources - used to validate API requests
export const insertResourceSchema = createSelectSchema(resources)
  .extend({})
  .omit({
    id: true,
    userId: true,
    documentId: true,
    pageNumber: true,
    chunkIndex: true,
    contentType: true,
    createdAt: true,
    updatedAt: true,
  });

// Type for resources - used to type API request params and within Components
export type NewResourceParams = z.infer<typeof insertResourceSchema>;
