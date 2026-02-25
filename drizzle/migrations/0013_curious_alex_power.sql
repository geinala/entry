ALTER TABLE "simulation_uploaded_files" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."simulation_upload_status_enum";--> statement-breakpoint
CREATE TYPE "public"."simulation_upload_status_enum" AS ENUM('uploaded', 'validating', 'failed', 'ready');--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" ALTER COLUMN "status" SET DATA TYPE "public"."simulation_upload_status_enum" USING "status"::"public"."simulation_upload_status_enum";