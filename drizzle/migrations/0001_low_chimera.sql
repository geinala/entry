ALTER TABLE "waitlist" RENAME COLUMN "full_name" TO "first_name";--> statement-breakpoint
ALTER TABLE "waitlist" DROP CONSTRAINT "waitlist_ticket_id_unique";--> statement-breakpoint
DROP INDEX "idx_waitlist_ticket_id";--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "last_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist" DROP COLUMN "ticket_id";