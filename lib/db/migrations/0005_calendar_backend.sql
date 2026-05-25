CREATE TABLE "calendar_events" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"date" timestamp NOT NULL,
	"event_type" varchar(32) DEFAULT 'custom' NOT NULL,
	"quiz_id" varchar(191),
	"classroom_id" varchar(191),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "quiz_date" timestamp;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "calendar_event_user_date_idx" ON "calendar_events" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "calendar_event_quiz_idx" ON "calendar_events" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "calendar_event_type_date_idx" ON "calendar_events" USING btree ("event_type","date");
