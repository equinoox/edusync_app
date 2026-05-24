CREATE TABLE "classroom_memberships" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"classroom_id" varchar(191) NOT NULL,
	"student_id" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"professor_id" varchar(191) NOT NULL,
	"icon" varchar(64) NOT NULL,
	"color" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_materials" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"lesson_id" varchar(191) NOT NULL,
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
CREATE TABLE "lessons" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"classroom_id" varchar(191) NOT NULL,
	"sequence_number" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "classroom_memberships" ADD CONSTRAINT "classroom_memberships_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_materials" ADD CONSTRAINT "lesson_materials_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "classroom_student_unique" ON "classroom_memberships" USING btree ("classroom_id","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_sequence_unique" ON "lessons" USING btree ("classroom_id","sequence_number");