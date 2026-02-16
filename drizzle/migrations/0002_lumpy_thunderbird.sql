ALTER TABLE "waitlist" ADD COLUMN "ticket_id" varchar;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_ticket_id_unique" UNIQUE("ticket_id");