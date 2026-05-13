CREATE TYPE "public"."simulation_cleaning_status_enum" AS ENUM('pending', 'cleaning', 'completed', 'need_review', 'failed');--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "file_validation_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "file_validation_status" SET DEFAULT 'uploaded'::text;--> statement-breakpoint
DROP TYPE "public"."simulation_file_validation_status_enum";--> statement-breakpoint
CREATE TYPE "public"."simulation_file_validation_status_enum" AS ENUM('uploaded', 'validating', 'validated', 'need_review', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "file_validation_status" SET DEFAULT 'uploaded'::"public"."simulation_file_validation_status_enum";--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "file_validation_status" SET DATA TYPE "public"."simulation_file_validation_status_enum" USING "file_validation_status"::"public"."simulation_file_validation_status_enum";--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "progress_cleaning_percentage" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "cleaning_status" "simulation_cleaning_status_enum" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "cleaning_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "cleaning_completed_at" timestamp with time zone;