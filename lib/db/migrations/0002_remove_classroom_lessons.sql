CREATE TABLE IF NOT EXISTS "classroom_materials" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"classroom_id" varchar(191) NOT NULL,
	"title" varchar(255) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_url" text NOT NULL,
	"storage_key" text,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classroom_materials" ADD CONSTRAINT "classroom_materials_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 IF to_regclass('public.lesson_materials') IS NOT NULL AND to_regclass('public.lessons') IS NOT NULL THEN
  INSERT INTO "classroom_materials" (
  	"id",
  	"classroom_id",
  	"title",
  	"file_name",
  	"file_url",
  	"storage_key",
  	"mime_type",
  	"size",
  	"created_at",
  	"updated_at"
  )
  SELECT
  	"lesson_materials"."id",
  	"lessons"."classroom_id",
  	"lesson_materials"."title",
  	"lesson_materials"."file_name",
  	"lesson_materials"."file_url",
  	"lesson_materials"."storage_key",
  	"lesson_materials"."mime_type",
  	"lesson_materials"."size",
  	"lesson_materials"."created_at",
  	"lesson_materials"."updated_at"
  FROM "lesson_materials"
  INNER JOIN "lessons" ON "lessons"."id" = "lesson_materials"."lesson_id"
  ON CONFLICT ("id") DO NOTHING;
 END IF;
END $$;
--> statement-breakpoint
DROP TABLE IF EXISTS "lesson_materials";
--> statement-breakpoint
DROP TABLE IF EXISTS "lessons";
