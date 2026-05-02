CREATE TYPE "public"."address_type_enum" AS ENUM('street', 'residential', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."address_validation_source_enum" AS ENUM('manual_correction', 'recommendation', 'original', 'skipped');--> statement-breakpoint
CREATE TABLE "address_validations" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_job_id" uuid,
	"nosi" varchar NOT NULL,
	"row_number" integer NOT NULL,
	"original_address" varchar NOT NULL,
	"cleaned_address" varchar NOT NULL,
	"street_candidate" varchar,
	"fallback_candidate" varchar NOT NULL,
	"processed_address" varchar NOT NULL,
	"address_type" "address_type_enum" DEFAULT 'unknown' NOT NULL,
	"nearby_recommended_address" varchar,
	"validation_source" "address_validation_source_enum" DEFAULT 'original' NOT NULL,
	"corrected_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "simulation_job_uploaded_file_errors" ADD COLUMN "field_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_job_uploaded_file_errors" ADD COLUMN "invalid_value" text NOT NULL;--> statement-breakpoint
ALTER TABLE "address_validations" ADD CONSTRAINT "address_validations_simulation_job_id_simulation_jobs_id_fk" FOREIGN KEY ("simulation_job_id") REFERENCES "public"."simulation_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "address_validations_simulation_job_id_idx" ON "address_validations" USING btree ("simulation_job_id");--> statement-breakpoint
CREATE INDEX "address_validations_nosi_idx" ON "address_validations" USING btree ("nosi");