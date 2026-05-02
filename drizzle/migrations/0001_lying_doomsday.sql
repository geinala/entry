CREATE TABLE "simulation_job_uploaded_file_errors" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_job_id" uuid,
	"row_number" integer NOT NULL,
	"error_message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "simulations" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "simulations" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."simulation_status_enum";--> statement-breakpoint
CREATE TYPE "public"."simulation_status_enum" AS ENUM('pending', 'processing', 'running', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "simulations" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."simulation_status_enum";--> statement-breakpoint
ALTER TABLE "simulations" ALTER COLUMN "status" SET DATA TYPE "public"."simulation_status_enum" USING "status"::"public"."simulation_status_enum";--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "processed_rows" integer;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "progress_percentage" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "simulation_job_uploaded_file_errors" ADD CONSTRAINT "simulation_job_uploaded_file_errors_simulation_job_id_simulation_jobs_id_fk" FOREIGN KEY ("simulation_job_id") REFERENCES "public"."simulation_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "simulation_job_uploaded_file_errors_simulation_job_id_idx" ON "simulation_job_uploaded_file_errors" USING btree ("simulation_job_id");--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" DROP COLUMN "file_error_path";