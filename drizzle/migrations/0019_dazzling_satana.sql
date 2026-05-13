CREATE TYPE "public"."resolution_status" AS ENUM('pending', 'auto_solved', 'needed_review', 'failed', 'manual_override');--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" RENAME COLUMN "cleaned_address" TO "normalized_address";--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" RENAME COLUMN "street_candidate" TO "suggested_address";--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "progress_geocoding_percentage" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "estimated_completion_time" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD COLUMN "geocode_score" double precision;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD COLUMN "geocode_provider" varchar;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD COLUMN "geocode_response" jsonb;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD COLUMN "resolution_status" "resolution_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD COLUMN "resolution_source" varchar;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" DROP COLUMN "fallback";