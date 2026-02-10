CREATE TYPE "public"."waitlist_status_enum" AS ENUM('pending', 'approved', 'rejected', 'invited');--> statement-breakpoint
CREATE TABLE "waitlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"full_name" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "waitlist_status_enum" DEFAULT 'pending' NOT NULL,
	"source" varchar DEFAULT 'organic' NOT NULL,
	"confirmed_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"ip_address" varchar,
	CONSTRAINT "waitlists_email_unique" UNIQUE("email")
);
