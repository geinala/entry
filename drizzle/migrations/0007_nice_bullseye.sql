ALTER TABLE "waitlist" ADD COLUMN "clerk_invitation_id" varchar;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_clerk_invitation_id_unique" UNIQUE("clerk_invitation_id");