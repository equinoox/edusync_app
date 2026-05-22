ALTER TABLE "resources" ADD COLUMN "document_id" varchar(191);
ALTER TABLE "documents" ADD COLUMN "file_type" varchar(100) DEFAULT 'application/pdf' NOT NULL;
ALTER TABLE "documents" ADD COLUMN "storage_key" text;
UPDATE "resources"
SET "document_id" = "documents"."id"
FROM "documents"
WHERE "documents"."resource_id" = "resources"."id";
ALTER TABLE "documents" DROP CONSTRAINT "documents_resource_id_resources_id_fk";
ALTER TABLE "documents" DROP COLUMN "resource_id";
ALTER TABLE "resources" ADD CONSTRAINT "resources_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;