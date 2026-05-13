ALTER TABLE "simulation_jobs" RENAME COLUMN "total_rows" TO "file_total_rows";--> statement-breakpoint
ALTER TABLE "simulation_jobs" RENAME COLUMN "valid_rows" TO "file_valid_rows";--> statement-breakpoint
ALTER TABLE "simulation_jobs" RENAME COLUMN "invalid_rows" TO "file_invalid_rows";--> statement-breakpoint
ALTER TABLE "simulation_jobs" RENAME COLUMN "processed_rows" TO "file_processed_rows";--> statement-breakpoint
ALTER TABLE "simulation_jobs" RENAME COLUMN "progress_percentage" TO "file_progress_percentage";--> statement-breakpoint
ALTER TABLE "simulation_jobs" RENAME COLUMN "validation_started_at" TO "file_validation_started_at";--> statement-breakpoint
ALTER TABLE "simulation_jobs" RENAME COLUMN "validation_completed_at" TO "file_validation_completed_at";--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "cleaning_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "cleaning_status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."simulation_cleaning_status_enum";--> statement-breakpoint
CREATE TYPE "public"."simulation_cleaning_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'needed_review', 'failed');--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "cleaning_status" SET DEFAULT 'pending'::"public"."simulation_cleaning_status_enum";--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "cleaning_status" SET DATA TYPE "public"."simulation_cleaning_status_enum" USING "cleaning_status"::"public"."simulation_cleaning_status_enum";--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "cleaning_total_rows" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "cleaning_processed_rows" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "cleaning_progress_percentage" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "geocoding_total_rows" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "geocoding_processed_rows" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "geocoding_progress_percentage" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "geocoding_estimated_completion_time" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "simulation_jobs" DROP COLUMN "progress_cleaning_percentage";--> statement-breakpoint
ALTER TABLE "simulation_jobs" DROP COLUMN "progress_geocoding_percentage";--> statement-breakpoint
ALTER TABLE "simulation_jobs" DROP COLUMN "estimated_completion_time";