CREATE TABLE "notifications" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"type" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"link" text,
	"read" boolean DEFAULT false NOT NULL,
	"related_classroom_id" varchar(191),
	"related_quiz_id" varchar(191),
	"related_material_id" varchar(191),
	"related_calendar_event_id" varchar(191),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_classroom_id_classrooms_id_fk" FOREIGN KEY ("related_classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_quiz_id_quizzes_id_fk" FOREIGN KEY ("related_quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_material_id_classroom_materials_id_fk" FOREIGN KEY ("related_material_id") REFERENCES "public"."classroom_materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_calendar_event_id_calendar_events_id_fk" FOREIGN KEY ("related_calendar_event_id") REFERENCES "public"."calendar_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notification_user_created_at_idx" ON "notifications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "notification_user_read_idx" ON "notifications" USING btree ("user_id","read");--> statement-breakpoint
CREATE UNIQUE INDEX "notification_calendar_event_unique" ON "notifications" USING btree ("user_id","type","related_calendar_event_id");
