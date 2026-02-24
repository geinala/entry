CREATE TYPE "public"."simulation_upload_status_enum" AS ENUM('uploaded', 'validating', 'failed', 'ready', 'processing', 'done');--> statement-breakpoint
CREATE TABLE "simulation_uploaded_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"file_url" varchar NOT NULL,
	"total_rows" integer,
	"invalid_rows" integer,
	"status" "simulation_upload_status_enum" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" ADD CONSTRAINT "simulation_uploaded_files_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "simulation_uploaded_files_simulation_id_idx" ON "simulation_uploaded_files" USING btree ("simulation_id");