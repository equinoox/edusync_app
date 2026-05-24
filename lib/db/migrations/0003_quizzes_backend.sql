CREATE TABLE "quizzes" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"professor_id" varchar(191) NOT NULL,
	"classroom_id" varchar(191),
	"title" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"total_points" numeric(10, 2) DEFAULT '0' NOT NULL,
	"weight" numeric(10, 2) DEFAULT '0' NOT NULL,
	"time_limit_minutes" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"quiz_id" varchar(191) NOT NULL,
	"sequence_number" integer NOT NULL,
	"content" text NOT NULL,
	"points" numeric(10, 2) NOT NULL,
	"has_negative_points" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_question_options" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"question_id" varchar(191) NOT NULL,
	"label" varchar(1) NOT NULL,
	"content" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"quiz_id" varchar(191) NOT NULL,
	"student_id" varchar(191) NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"submitted_at" timestamp,
	"time_spent_seconds" integer,
	"score" numeric(10, 2) DEFAULT '0' NOT NULL,
	"max_score" numeric(10, 2) DEFAULT '0' NOT NULL,
	"accuracy_percent" numeric(5, 2) DEFAULT '0' NOT NULL,
	"status" varchar(32) DEFAULT 'in_progress' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_answers" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"attempt_id" varchar(191) NOT NULL,
	"question_id" varchar(191) NOT NULL,
	"selected_option_ids" jsonb NOT NULL,
	"is_correct" boolean NOT NULL,
	"points_earned" numeric(10, 2) NOT NULL,
	"time_spent_seconds" integer
);
--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_question_options" ADD CONSTRAINT "quiz_question_options_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_attempt_id_quiz_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "question_option_label_unique" ON "quiz_question_options" USING btree ("question_id","label");--> statement-breakpoint
CREATE UNIQUE INDEX "quiz_student_attempt_unique" ON "quiz_attempts" USING btree ("quiz_id","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "attempt_question_answer_unique" ON "quiz_answers" USING btree ("attempt_id","question_id");
