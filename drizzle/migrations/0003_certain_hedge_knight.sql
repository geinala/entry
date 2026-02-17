ALTER TYPE "public"."waitlist_status_enum" ADD VALUE 'sending' BEFORE 'confirmed';--> statement-breakpoint
CREATE INDEX "idx_waitlist_ticket_id" ON "waitlist" USING btree ("ticket_id");