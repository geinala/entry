ALTER TABLE "simulation_uploaded_rows" ADD COLUMN "latitude" double precision;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD COLUMN "longitude" double precision;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD COLUMN "is_ignored" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD COLUMN "deleted_at" timestamp with time zone;