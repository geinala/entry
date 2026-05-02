CREATE TYPE "public"."simulation_file_validation_status_enum" AS ENUM('uploaded', 'validating', 'validated', 'failed');--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "file_path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "file_validation_status" "simulation_file_validation_status_enum" DEFAULT 'uploaded' NOT NULL;