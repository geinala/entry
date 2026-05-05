CREATE TABLE "simulation_uploaded_rows" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_job_id" uuid,
	"nosi" varchar NOT NULL,
	"courier" varchar NOT NULL,
	"customer_name" varchar NOT NULL,
	"address" varchar NOT NULL,
	"city" varchar NOT NULL,
	"weight" real NOT NULL,
	"start_datetime" timestamp with time zone NOT NULL,
	"end_datetime" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"error_details" jsonb
);
--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD CONSTRAINT "simulation_uploaded_rows_simulation_job_id_simulation_jobs_id_fk" FOREIGN KEY ("simulation_job_id") REFERENCES "public"."simulation_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "simulation_uploaded_rows_simulation_job_id_idx" ON "simulation_uploaded_rows" USING btree ("simulation_job_id");--> statement-breakpoint
CREATE INDEX "simulation_uploaded_rows_nosi_idx" ON "simulation_uploaded_rows" USING btree ("nosi");