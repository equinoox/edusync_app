CREATE TABLE "chat_messages" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"session_id" varchar(191) NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"role" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"title" varchar(255) NOT NULL,
	"preview" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
