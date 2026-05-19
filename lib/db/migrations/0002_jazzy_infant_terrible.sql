CREATE TABLE "user_tokens" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"messages_used" integer DEFAULT 0 NOT NULL,
	"last_reset_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_tokens_user_id_unique" UNIQUE("user_id")
);
