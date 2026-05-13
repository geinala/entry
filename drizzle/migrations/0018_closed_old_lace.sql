ALTER TABLE "simulation_jobs" ALTER COLUMN "cleaning_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "cleaning_status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."simulation_cleaning_status_enum";--> statement-breakpoint
CREATE TYPE "public"."simulation_cleaning_status_enum" AS ENUM('pending', 'cleaning', 'completed', 'needed_review', 'failed');--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "cleaning_status" SET DEFAULT 'pending'::"public"."simulation_cleaning_status_enum";--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "cleaning_status" SET DATA TYPE "public"."simulation_cleaning_status_enum" USING "cleaning_status"::"public"."simulation_cleaning_status_enum";--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "file_validation_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "file_validation_status" SET DEFAULT 'uploaded'::text;--> statement-breakpoint
DROP TYPE "public"."simulation_file_validation_status_enum";--> statement-breakpoint
CREATE TYPE "public"."simulation_file_validation_status_enum" AS ENUM('uploaded', 'validating', 'validated', 'needed_review', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "file_validation_status" SET DEFAULT 'uploaded'::"public"."simulation_file_validation_status_enum";--> statement-breakpoint
ALTER TABLE "simulation_jobs" ALTER COLUMN "file_validation_status" SET DATA TYPE "public"."simulation_file_validation_status_enum" USING "file_validation_status"::"public"."simulation_file_validation_status_enum";