ALTER TABLE "waitlist" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."waitlist_status_enum";--> statement-breakpoint
CREATE TYPE "public"."waitlist_status_enum" AS ENUM('pending', 'sending', 'confirmed', 'denied', 'invited', 'revoked', 'failed', 'expired');--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."waitlist_status_enum";--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "status" SET DATA TYPE "public"."waitlist_status_enum" USING "status"::"public"."waitlist_status_enum";