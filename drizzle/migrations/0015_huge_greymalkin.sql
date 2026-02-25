ALTER TABLE "simulation_uploaded_files" ADD COLUMN "processed_rows" integer;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" ADD COLUMN "progress_percentage" integer DEFAULT 0;