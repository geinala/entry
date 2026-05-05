ALTER TYPE "public"."simulation_file_validation_status_enum" ADD VALUE 'reviewing' BEFORE 'failed';--> statement-breakpoint
ALTER TYPE "public"."simulation_file_validation_status_enum" ADD VALUE 'completed' BEFORE 'failed';--> statement-breakpoint
DROP TABLE "simulation_job_uploaded_file_errors" CASCADE;