ALTER TYPE "public"."waitlist_status_enum" ADD VALUE 'revoked' BEFORE 'expired';--> statement-breakpoint
ALTER TYPE "public"."waitlist_status_enum" ADD VALUE 'failed' BEFORE 'expired';